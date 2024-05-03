import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import toast from "react-hot-toast";
import { mailAtom } from "../recoil/mailAtom";
import { userNameAtom } from "../recoil/userNameAtom";
import { passwordAtom } from "../recoil/passwordAtom";
import axios from "axios";
import { roleAtom } from "../recoil/roleAtom";
import { duration } from "@mui/material";
import { loadingAtom } from "../recoil/loadingAtom";
import { session1Atom } from "../recoil/session1Atom";

function Signup() {
  const navigate = useNavigate();
  const mailId = useRecoilValue(mailAtom);
  const s1 = useSetRecoilState(session1Atom);
  const [username, setUserName] = useRecoilState(userNameAtom);
  const role = useRecoilValue(roleAtom);
  const setLoad = useSetRecoilState(loadingAtom);
  const [password, setPassword] = useRecoilState(passwordAtom);
  const [psswd, setPsswd] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (psswd === password) {
      setLoad(true);
      const passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$_!])[A-Za-z\d@#$_!]{8,}$/;
      const usernamePattern = /^[a-zA-Z][a-zA-Z0-9_]{6,}$/;
      if (!usernamePattern.test(username)) {
        setLoad(false);
        toast.error(
          "username must start with [a-z] or [A-Z] and should only contain 0-9 and _ with min 6 characters"
        );
        return;
      }
      if (!passwordPattern.test(password)) {
        setLoad(false);
        toast.error(
          "password must contain [a-z],[A-Z],0-9 and @#$^_ with min 8 characters"
        );
        return;
      }
      const response =
        role === "R"
          ? await axios.post("https://filmy-buffs-backend.vercel.app/recruiter/signup", {
              username: username,
              password: password,
              mailId: mailId,
            })
          : await axios.post("https://filmy-buffs-backend.vercel.app/user/signup", {
              username: username,
              password: password,
              mailId: mailId,
            });
      if (response.data.success) {
        role === "R"
          ? localStorage.setItem("role", "Recruiter")
          : localStorage.setItem("role", "User");
        toast.success("Signup successfull!");
        const token = response.data.token;
        localStorage.setItem("token", token);
        s1(true);
        navigate("/home/posts");
        setTimeout(() => {
          setLoad(false);
        }, 1000);
      } else {
        setLoad(false);
        toast.error(response.data.message);
        return;
      }
    } else {
      toast.error("passwords doesn't match!");
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img
            className="w-8 h-8 mr-2"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
          />
          FilmyBuffs
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <form
              className="space-y-4 md:space-y-6 flex flex-col"
              autoComplete="off"
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
                  autoFocus
                  id="username"
                  value={username}
                  onChange={(e) => {
                    setUserName(e.target.value);
                  }}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="enter your username"
                  required
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
                  placeholder="••••••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Confirm password
                </label>
                <input
                  type="password"
                  name="confirm-password"
                  id="confirm-password"
                  value={psswd}
                  onChange={(e) => {
                    setPsswd(e.target.value);
                  }}
                  placeholder="••••••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="mx-auto rounded bg-neutral-50 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-neutral-800 shadow-[0_4px_9px_-4px_#cbcbcb] transition duration-150 ease-in-out hover:bg-neutral-100 hover:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] focus:bg-neutral-100 focus:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] focus:outline-none focus:ring-0 active:bg-neutral-200 active:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(251,251,251,0.3)] dark:hover:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)] dark:focus:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)] dark:active:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)]"
              >
                Register
              </button>

              <p className="text-sm text-center font-light text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  onClick={(e) => {
                    e.preventDefault();
                    setLoad(true);
                    navigate("/signin");
                    setTimeout(() => {
                      setLoad(false);
                    }, 800);
                  }}
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  signin
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Signup;
