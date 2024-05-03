import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { userNameAtom } from "../recoil/userNameAtom";
import { passwordAtom } from "../recoil/passwordAtom";
import { loadingAtom } from "../recoil/loadingAtom";
import axios from "axios";
import toast from "react-hot-toast";
import { roleAtom } from "../recoil/roleAtom";
import { session1Atom } from "../recoil/session1Atom";

function Signin() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const setLoad = useSetRecoilState(loadingAtom);
  const s1 = useSetRecoilState(session1Atom);
  const navigate = useNavigate();
  const [role, setRole] = useRecoilState(roleAtom);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad(true);
    const response =
      role === "rec"
        ? await axios.post("https://filmy-buffs-backend.vercel.app/recruiter/signin", {
            username: username,
            password: password,
          })
        : await axios.post("https://filmy-buffs-backend.vercel.app/user/signin", {
            username: username,
            password: password,
          });
    if (response.data.success) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", role === "rec" ? "Recruiter" : "User");
      s1(true);
      navigate("/home/posts");
      setTimeout(() => {
        setLoad(false);
        toast.success("signin successfull!");
      }, 2000);
    } else {
      setTimeout(() => {
        setLoad(false);
        toast.error(response.data.message);
      }, 600);
    }
  };
  return (
    <div className="flex bg-gray-50 dark:bg-gray-900 flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
        <img
          className="w-8 h-8 mr-2"
          src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
          alt="logo"
        />
        FilmyBuffs
      </div>
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <form
            className="space-y-3 md:space-y-6 flex flex-col"
            onSubmit={handleSubmit}
          >
            <div>
              <label
                htmlFor="username"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                value={username}
                onChange={(e) => {
                  setUserName(e.target.value);
                }}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="enter your username"
                required
                autoFocus
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
            </div>
            <div className="flex gap-5">
              <div className="flex justify-center items-center gap-1 text-gray-200">
                <input
                  type="radio"
                  className="h-4 w-4"
                  name="role"
                  id="rec"
                  required
                  checked={role === "rec"}
                  onChange={(e) => {
                    setRole(e.target.id);
                  }}
                />
                Recruiter
              </div>
              <div className="flex justify-center items-center gap-1 text-gray-200">
                <input
                  type="radio"
                  className="h-4 w-4"
                  name="role"
                  id="uss"
                  required
                  checked={role === "uss"}
                  onChange={(e) => {
                    setRole(e.target.id);
                  }}
                />
                User
              </div>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  setLoad(true);
                  setTimeout(() => {
                    setLoad(false);
                  }, 800);
                  navigate("/forgot");
                }}
                className="w-full hover:text-blue-400 select-none cursor-pointer text-right scale-95 text-gray-300 hover:underline"
              >
                forgot password?
              </div>
            </div>
            <button
              type="submit"
              className="mx-auto rounded bg-neutral-50 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-neutral-800 shadow-[0_4px_9px_-4px_#cbcbcb] transition duration-150 ease-in-out hover:bg-neutral-100 hover:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] focus:bg-neutral-100 focus:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] focus:outline-none focus:ring-0 active:bg-neutral-200 active:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(251,251,251,0.3)] dark:hover:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)] dark:focus:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)] dark:active:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)]"
            >
              Signin
            </button>

            <p className="text-sm text-center font-light text-gray-500 dark:text-gray-400">
              Don't have an account?
              <span
                onClick={(e) => {
                  e.preventDefault();
                  setLoad(true);
                  setTimeout(() => {
                    setLoad(false);
                  }, 800);
                  navigate("/mail");
                }}
                className="font-medium select-none cursor-pointer text-primary-600 hover:underline dark:text-primary-500"
              >
                {" "}
                Register
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signin;
