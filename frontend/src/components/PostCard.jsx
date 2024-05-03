import DeleteIcon from "@mui/icons-material/Delete";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DescriptionIcon from "@mui/icons-material/Description";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Button, StepIcon, Tooltip } from "@mui/material";
import ShowLikes from "./ShowLikes";
import EditPostDrawer from "./EditPost.drawer";
import tickMark from "../assets/tick-mark.png";
import { useRecoilValue, useSetRecoilState } from "recoil";
import ShowApplications from "./ShowApplications";
import { profileAtom } from "../recoil/profileAtom";
import axios from "axios";
import toast from "react-hot-toast";
import hired from "../assets/hired.png";
import { homeLoadAtom } from "../recoil/homeLoadAtom";
import ApplyPostDrawer from "./ApplyPost.drawer";
function PostCard(props) {
  const navigate = useNavigate();
  const profile = useRecoilValue(profileAtom);
  const [like, setLike] = useState(false);
  const setHomeLoad = useSetRecoilState(homeLoadAtom);
  const getFileExtension = (url) => {
    return url.split(".").pop().toLowerCase();
  };

  const selectedUsers = [];
  const appliedUsers = [];
  props.post.selections.map((sel) => {
    selectedUsers.push(sel.username);
  });
  props.post.applications.map((aplcn) => {
    appliedUsers.push(aplcn.username);
  });

  const imgUrls = ["jpg", "jpeg", "png", "gif", "webp"];
  const mp4Urls = ["mp4", "mov", "avi", "mkv"];
  function getTimeDifference(dateString) {
    const postDate = new Date(dateString);
    const currentDate = new Date();

    const timeDifferenceInMilliseconds = currentDate - postDate;
    const timeDifferenceInSeconds = timeDifferenceInMilliseconds / 1000;

    const minutesAgo = Math.floor(timeDifferenceInSeconds / 60);

    if (minutesAgo < 60) {
      return `${minutesAgo} minutes ago`;
    } else if (minutesAgo < 24 * 60) {
      const hoursAgo = Math.floor(minutesAgo / 60);
      return `${hoursAgo} hours ago`;
    } else if (minutesAgo < 30 * 24 * 60) {
      const daysAgo = Math.floor(minutesAgo / (60 * 24));
      return `${daysAgo} days ago`;
    } else {
      const monthsAgo = Math.floor(minutesAgo / (60 * 24 * 30));
      return `${monthsAgo} months ago`;
    }
  }

  return (
    <article
      className={`p-6 bg-white rounded-lg border-2 bgrrr border-gray-200 shadow-md dark:bg-gray-900 w-[90%] mx-auto sm:w-[45rem] dark:border-gray-700`}
    >
      <div className="flex justify-between items-center mb-5 text-gray-500">
        <span className="text-sm">{getTimeDifference(props.post.date)}</span>
        <div className="flex justify-center gap-1 items-center">
          <Tooltip title="category">
            <Button
              variant="contained"
              color="secondary"
              style={{
                fontSize: "0.9rem",
                scale: "0.8",
                textTransform: "capitalize",
              }}
            >
              {props.post.category}
            </Button>
          </Tooltip>

          {localStorage.getItem("role") !== "Recruiter" ? (
            <Button
              variant="contained"
              color={
                profile.following.includes(props.post.postedBy)
                  ? "error"
                  : "info"
              }
              onClick={async () => {
                setHomeLoad(true);
                const response = await axios.post(
                  `https://filmy-buffs-backend.vercel.app/user/follow/${props.post.postedBy}`,
                  {
                    factor: "r",
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  }
                );
                if (response.data.success) {
                  toast.success(response.data.message);
                  setHomeLoad(false);
                } else {
                  setHomeLoad(false);
                  toast.error(response.data.message);
                }
              }}
              style={{
                fontSize: "0.9rem",
                scale: "0.8",
                textTransform: "capitalize",
              }}
            >
              {profile.following.includes(props.post.postedBy)
                ? "Unfollow"
                : "Follow"}
            </Button>
          ) : (
            ""
          )}
          {localStorage.getItem("role") === "Recruiter" ? (
            <EditPostDrawer postId={props.post._id} />
          ) : (
            ""
          )}
          {localStorage.getItem("role") === "Recruiter" ? (
            <Tooltip title="remove">
              <DeleteIcon
                className="text-gray-200 cursor-pointer"
                onClick={async (e) => {
                  e.preventDefault();
                  setHomeLoad(true);
                  const response = await axios.delete(
                    `https://filmy-buffs-backend.vercel.app/recruiter/remove/${props.post._id}`,
                    {
                      headers: {
                        Authorization:
                          "Bearer " + localStorage.getItem("token"),
                      },
                    }
                  );

                  if (response.data.success) {
                    setHomeLoad(false);
                    toast.success(response.data.message);
                  } else {
                    setHomeLoad(false);
                    toast.error(response.data.message);
                  }
                }}
              />
            </Tooltip>
          ) : (
            ""
          )}
        </div>
      </div>
      <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {props.post.title}
      </h2>
      <p className="mb-5 py-1 text-[1.1rem] font-light text-gray-500 dark:text-gray-300">
        {props.post.description}
      </p>
      <div
        className={
          localStorage.getItem("role") !== "Recruiter"
            ? " mb-6 "
            : "" + " relative "
        }
        // className=" mb-6"
      >
        {props.post.attachment ? (
          imgUrls.includes(getFileExtension(props.post.attachment)) ? (
            <img
              className={`w-[64%] shadow-sm shadow-white m-1 my-3 rounded-lg`}
              src={props.post.attachment}
              // src="http://res.cloudinary.com/dk7jgtorh/image/upload/v1712300586/Temporary/bqtxzpgl6scs4nsuwy30.webp"
            />
          ) : mp4Urls.includes(getFileExtension(props.post.attachment)) ? (
            <video controls src={props.post.attachment} />
          ) : (
            ""
          )
        ) : (
          ""
        )}
      </div>
      {/* <img src={hired} className="absolute translate-y-[10rem]" alt="" srcset="" /> */}
      <div className="flex justify-between items-center">
        <div className="flex pt-2 sm:pt-0 items-center space-x-3">
          {props.post.profileImage ? (
            <img
              className="w-8 h-8 rounded-full outline-2 outline-gray-400 scale-105 p-0.5 outline"
              src={props.post.profileImage}
              alt="profile"
            />
          ) : (
            <div className="relative w-8 h-8 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
              <svg
                className="absolute w-10 h-10 text-gray-400 -left-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillrlue="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  cliprlue="evenodd"
                ></path>
              </svg>
            </div>
          )}
          <span className="font-medium flex gap-1 justify-center items-center dark:text-white">
            {props.post.username}
            <img src={tickMark} className="h-5" alt="" srcSet="" />
          </span>
        </div>
        <div
          className={`flex justify-center items-center select-none ${
            localStorage.getItem("role") !== "Recruiter"
              ? " gap-2.5 "
              : " gap-0 "
          }`}
        >
          <div className="flex flex-col gap-1 scale-90">
            <div
              className={`flex justify-center text-white items-center gap-1 
            ${localStorage.getItem("role") === "User" ? " scale-[1.4] " : ""}`}
            >
              <Tooltip title="likes">
                <FavoriteIcon
                  style={{
                    color:
                      localStorage.getItem("role") !== "Recruiter" &&
                      profile.likedPosts.includes(props.post._id)
                        ? "red"
                        : "",
                  }}
                  onClick={
                    localStorage.getItem("role") !== "Recruiter"
                      ? async () => {
                          setHomeLoad(true);
                          const response = await axios.post(
                            `https://filmy-buffs-backend.vercel.app/user/like/${props.post._id}`,
                            {
                              factor: "p",
                            },
                            {
                              headers: {
                                Authorization: `Bearer ${localStorage.getItem(
                                  "token"
                                )}`,
                              },
                            }
                          );
                          if (response.data.success) {
                            toast.success(response.data.message);
                            setHomeLoad(false);
                          } else {
                            setHomeLoad(false);
                            toast.error(response.data.message);
                          }
                        }
                      : () => {}
                  }
                />
              </Tooltip>
              {props.post.likedBy.length}
            </div>
            {localStorage.getItem("role") === "Recruiter" ? (
              <div className="hidden">
                <ShowLikes likes={props.post.likes} />
              </div>
            ) : (
              ""
            )}
          </div>

          {localStorage.getItem("role") === "Recruiter" &&
          props.post.category !== "update" ? (
            <div className="flex flex-col text-white scale-90 gap-1">
              <div className="flex pl-2 sm:pl-0 justify-center items-center gap-1">
                <Tooltip title="applications">
                  <DescriptionIcon />
                </Tooltip>
                {props.post.appliedBy.length}
              </div>
              <div className="hidden">
                <ShowApplications
                  postId={props.post._id}
                  blockList={props.post.blockList}
                  selections={props.post.selections}
                  applications={props.post.applications}
                />
              </div>
            </div>
          ) : localStorage.getItem("role") !== "Recruiter" &&
            props.post.category !== "update" &&
            !selectedUsers.includes(profile.username) ? (
            <div class="relative inline-flex items-center justify-center px-1 scale-[0.85] py-2 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out border-2 border-purple-500 rounded-full shadow-md group cursor-pointer">
              <span class="absolute inset-0 flex items-center justify-center w-full h-full text-gray-200 duration-300 -translate-x-full bg-purple-500 group-hover:translate-x-0 ease cursor-pointer">
                {appliedUsers.includes(profile.username) ? (
                  "applied"
                ) : (
                  <ApplyPostDrawer postId={props.post._id} />
                )}
              </span>
              <span class="absolute flex items-center gap- justify-center w-full h-full text-purple-500 transition-all duration-300 transform group-hover:translate-x-full ease">
                {props.post.appliedBy.length} &nbsp; <PeopleAltIcon />
              </span>
              <span class="relative invisible">Button Text1</span>
            </div>
          ) : localStorage.getItem("role") !== "Recruiter" &&
            props.post.category !== "update" ? (
            <img
              src={hired}
              className="h-20 px-3 scale-[1.3] translate-y-0.5 rotate-[20deg]"
              alt=""
              srcset=""
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </article>
  );
}

export default PostCard;
