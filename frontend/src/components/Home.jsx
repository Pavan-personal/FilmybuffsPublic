import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { loadingAtom } from "../recoil/loadingAtom";
import toast from "react-hot-toast";
import { mailAtom } from "../recoil/mailAtom";
import { passwordAtom } from "../recoil/passwordAtom";
import { roleAtom } from "../recoil/roleAtom";
import { userNameAtom } from "../recoil/userNameAtom";
import { needAtom } from "../recoil/needAtom";
import Navbar from "./Navbar";
import Intro from "./Intro";
import { homeLoadAtom } from "../recoil/homeLoadAtom";

function Home() {
  const [posts, setPosts] = useState([]);
  const setLoad = useSetRecoilState(loadingAtom);
  const setHomeLoad = useSetRecoilState(homeLoadAtom);

  console.log(posts);
  const setMail = useSetRecoilState(mailAtom);
  const setNeed = useSetRecoilState(needAtom);
  const setPassword = useSetRecoilState(passwordAtom);
  const setRole = useSetRecoilState(roleAtom);
  const setUserName = useSetRecoilState(userNameAtom);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setLoad(true);
    setMail("");
    setNeed("");
    setPassword("");
    setRole("");
    setUserName("");
    navigate("/");
    window.location.reload();
    setTimeout(() => {
      toast.success("logged out successfully!");
      setLoad(false);
      return;
    }, 200);
  };

  useEffect(() => {
    localStorage.getItem("token") === null;
  }, []);

  return (
    <div className="">
      {localStorage.getItem("token") === null ? (
        <Intro />
      ) : (
        <div className="">
          <Navbar handleLogout={handleLogout} />
          <Outlet />
        </div>
      )}
    </div>
  );
}

export default Home;
