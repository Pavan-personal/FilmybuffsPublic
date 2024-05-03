import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { loadingAtom } from "../recoil/loadingAtom";
import toast from "react-hot-toast";
import PostCard from "./PostCard";
import { GridLoader } from "react-spinners";
import { Button, Icon, IconButton } from "@mui/material";
import SwipeableTemporaryDrawer from "./SwipeableTemporaryDrawer";
import SentimentDissatisfiedTwoToneIcon from "@mui/icons-material/SentimentDissatisfiedTwoTone";
import { homeLoadAtom } from "../recoil/homeLoadAtom";
import axios, { all } from "axios";
import { session1Atom } from "../recoil/session1Atom";
import { profileAtom } from "../recoil/profileAtom";
import { applicationAtom } from "../recoil/applicationAtom";
import { btnStyleAtom } from "../recoil/btnStyleAtom";
import { searchAtom } from "../recoil/searchAtom";

function MainHome() {
  const [search, setSearch] = useRecoilState(searchAtom);
  const [homeLoad, setHomeLoad] = useRecoilState(homeLoadAtom);
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [applcn, setApplcn] = useRecoilState(applicationAtom);
  const [profile, setProfile] = useRecoilState(profileAtom);
  const setSession1 = useSetRecoilState(session1Atom);
  useEffect(() => {
    const func = async () => {
      const response = await axios.get("https://filmy-buffs-backend.vercel.app/open/posts/all", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const profileResponse =
        localStorage.getItem("role") === "Recruiter"
          ? await axios.get("https://filmy-buffs-backend.vercel.app/recruiter/info", {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            })
          : await axios.get("https://filmy-buffs-backend.vercel.app/user/info", {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
      if (response.data.success && profileResponse.data.success) {
        setPosts(response.data.posts);
        const data = profileResponse.data.data;
        const followersList = profileResponse.data.followersList;
        const lastPost = profileResponse.data.lastPost;
        const engagement = profileResponse.data.engagement;
        setProfile({ ...data, followersList, lastPost, engagement });
        setAllPosts(response.data.posts);
        console.log(response.data.posts);
        const applcns = [];
        response.data.posts.map((pst) => {
          applcns.push(pst.applications);
        });
        setApplcn(applcns);
        // console.log(applcns);
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setSession1(false);
        setPosts([]);
        toast.error(response.data.message);
      }
    };
    setSearch("");
    setBtnStyle("b2");
    func();
  }, [homeLoad]);
  console.log(search);
  useEffect(() => {
    if (search === "" || !search) {
      setPosts(allPosts);
    } else {
      const pstss = allPosts.filter((pst) => {
        return (
          pst.title.toLowerCase().includes(search.toLowerCase().trim()) ||
          pst.username.toLowerCase().includes(search.toLowerCase().trim()) ||
          pst.description.toLowerCase().includes(search.toLowerCase().trim())
        );
      });
      setPosts(pstss);
    }
  }, [search]);
  const userPosts = () => {
    return allPosts.filter((post) => {
      return localStorage.getItem("role") === "Recruiter"
        ? post.username === profile.username
        : profile.following.includes(post.postedBy);
    });
  };
  const likedPosts =
    localStorage.getItem("role") !== "Recruiter"
      ? allPosts.filter((post) => {
          return profile.likedPosts.includes(post._id);
        })
      : "";

  const appliedPosts =
    localStorage.getItem("role") !== "Recruiter"
      ? allPosts.filter((post) => {
          return post.appliedBy.includes(profile._id);
        })
      : "";
  // console.log(appliedPosts() || appliedPosts);
  const navigate = useNavigate();
  const [btnStyle, setBtnStyle] = useRecoilState(btnStyleAtom);

  return (
    <div className="w-[80%] border-black">
      <div className="flex w-full min-h-[87vh]">
        <div className="w-full flex py-6 gap-5 flex-col items-center">
          {localStorage.getItem("role") === "Recruiter" ? (
            <div className="w-full flex gap-6 justify-center">
              <Button
                variant={btnStyle === "b1" ? "contained" : "outlined"}
                onClick={() => {
                  setPosts(userPosts);
                  setBtnStyle("b1");
                }}
              >
                Yours
              </Button>
              <Button
                variant={btnStyle === "b2" ? "contained" : "outlined"}
                onClick={() => {
                  setHomeLoad(true);
                  setBtnStyle("b2");
                  setTimeout(() => {
                    setHomeLoad(false);
                  }, 700);
                }}
              >
                Trending
              </Button>
            </div>
          ) : (
            <div className="w-full flex gap-6 justify-center">
              <Button
                variant={btnStyle === "b1" ? "contained" : "outlined"}
                onClick={() => {
                  setPosts(userPosts);
                  setBtnStyle("b1");
                  setTimeout(() => {}, 700);
                }}
              >
                Following
              </Button>
              <Button
                variant={btnStyle === "b2" ? "contained" : "outlined"}
                onClick={() => {
                  setHomeLoad(true);
                  setBtnStyle("b2");
                  setTimeout(() => {
                    setHomeLoad(false);
                  }, 700);
                }}
              >
                Latest
              </Button>
              <Button
                variant={btnStyle === "b3" ? "contained" : "outlined"}
                onClick={(e) => {
                  setPosts(likedPosts);
                  setBtnStyle("b3");
                  setTimeout(() => {}, 700);
                }}
              >
                Liked
              </Button>
              <Button
                variant={btnStyle === "b4" ? "contained" : "outlined"}
                onClick={(e) => {
                  setPosts(appliedPosts);
                  setBtnStyle("b4");
                  setTimeout(() => {}, 700);
                }}
              >
                Applied
              </Button>
            </div>
          )}

          {/* <SwipeableTemporaryDrawer /> */}
          {homeLoad ? (
            <GridLoader color="blue" className="translate-y-48"></GridLoader>
          ) : posts ? (
            posts.length > 0 ? (
              <div className="flex flex-col py-4 gap-6">
                {posts.map((post) => {
                  return (
                    <PostCard key={Math.random() * 10000000000} post={post} />
                  );
                })}
              </div>
            ) : (
              <img
                src="https://pngimg.com/d/ghost_PNG47.png"
                className="h-56 absolute translate-y-[13rem]"
                alt=""
                srcSet=""
              />
            )
          ) : (
            <GridLoader color="blue" className="translate-y-48"></GridLoader>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainHome;
