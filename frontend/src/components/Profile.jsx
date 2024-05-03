import { Menu, MenuItem, Tooltip, Button } from "@mui/material";
import React from "react";
import MailIcon from "@mui/icons-material/Mail";
import CallIcon from "@mui/icons-material/Call";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import { useRecoilState, useRecoilValue } from "recoil";
import tickMark from "../assets/tick-mark.png";
import { profileAtom } from "../recoil/profileAtom";
import { GridLoader, BeatLoader } from "react-spinners";
import PersonalInfoDialog from "./PersonalInfoDialog";
import ActivityDialog from "./ActivityDialog";
import SocialsDialog from "./SocialsDialog";
import DeleteAccDialog from "./DeleteAccDialog";

function Profile() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [profile, setProfile] = useRecoilState(profileAtom);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className="w-4xl border py-5 p-5 bg-gray-900 text-gray-200 rounded-xl border-gray-400 mx-auto">
      {profile ? (
        <div className="px-3 py-2">
          <div className="flex flex-col gap-1 text-center">
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                className="block mx-auto w-20 h-20 rounded-full border border-gray-400 shadow-lg"
                alt=""
                srcset=""
              />
            ) : (
              <div className="relative mx-auto w-[4.5rem] flex justify-center items-center h-[4.5rem] overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                <svg
                  className=" w-[3.8rem] h-[3.8rem] text-gray-400 "
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

            <p className="font-serif flex justify-center items-center gap-1 pt-1 font-semibold">
              {profile.username}{" "}
              {localStorage.getItem("role") === "Recruiter" ? (
                <img src={tickMark} className="h-5" alt="" srcSet="" />
              ) : (
                ""
              )}
            </p>
            <span className="text-sm w-56 text-gray-400">{profile.about}</span>
          </div>
          <div className="flex justify-center items-center gap-2 my-3">
            <div className="font-bold text-center mx-4">
              <p className="">
                {localStorage.getItem("role") === "Recruiter"
                  ? profile.createdPosts.length
                  : profile.acceptedPosts.length !== 0
                  ? (100 * profile.acceptedPosts.length) /
                    profile.appliedPosts.length
                  : 0}
              </p>
              <span className="text-gray-400">
                {localStorage.getItem("role") === "Recruiter"
                  ? "Posts"
                  : "Success %"}
              </span>
            </div>
            <div className="font-bold text-center mx-4">
              <p className="">
                {localStorage.getItem("role") === "Recruiter"
                  ? profile.followers.length
                  : profile.following.length}
              </p>
              <span className="text-gray-400">
                {" "}
                {localStorage.getItem("role") === "Recruiter"
                  ? "Followers"
                  : "Following"}
              </span>
            </div>
          </div>
       
          <div className="flex justify-center gap-2 my-5">
            <div className="grid grid-cols-2 gap-y-2.5 py-3 gap-x-1 min-w-fit">
              <PersonalInfoDialog />
              <ActivityDialog />
              <SocialsDialog />
              <DeleteAccDialog />
              <Tooltip title="go back">
                <Button
                  variant="contained"
                  sx={{
                    fontFamily: '"Apple Color Emoji"',
                  }}
                  style={{
                    borderRadius: "2rem",
                    textTransform: "capitalize",
                    backgroundColor: "rgb(30 ,64 ,175)",
                    paddingTop: "0.5rem",
                    paddingBottom: "0.5rem",
                    fontWeight: 600,
                    color: "rgb(226 ,232 ,255)",
                    fontSize: "0.92rem",
                  }}
                  id="back-button"
                  className="bg-blue-800 text-white px-8 py-2 rounded-full shadow-lg"
                >
                  Back
                </Button>
              </Tooltip>
              <Button
                variant="contained"
                sx={{
                  fontFamily: '"Apple Color Emoji"',
                }}
                style={{
                  borderRadius: "2rem",
                  textTransform: "capitalize",
                  backgroundColor: "rgb(30 ,64 ,175)",
                  paddingTop: "0.5rem",
                  paddingBottom: "0.5rem",
                  fontWeight: 600,
                  color: "rgb(230 ,255 ,255)",
                  fontSize: "0.92rem",
                  paddingLeft: "1.6rem",
                  paddingRight: "1.6rem",
                }}
                id="back-button"
                className="bg-blue-800 text-white px-8 py-2 rounded-full shadow-lg"
              >
                Cool 💖
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                autoFocus={false}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem onClick={handleClose}>Instagram</MenuItem>
                <MenuItem onClick={handleClose}>Twitter</MenuItem>
              </Menu>
            </div>
          </div>
        </div>
      ) : (
        <BeatLoader />
      )}
    </div>
  );
}

export default Profile;
