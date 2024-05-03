import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { userNameAtom } from "../recoil/userNameAtom";
import { passwordAtom } from "../recoil/passwordAtom";
import { loadingAtom } from "../recoil/loadingAtom";
import axios from "axios";
import toast from "react-hot-toast";
import { mailAtom } from "../recoil/mailAtom";
import { roleAtom } from "../recoil/roleAtom";

function SetPassword() {
  const [password, setPassword] = useRecoilState(passwordAtom);
  const [repassword, setRePassword] = useState("");
  const setLoad = useSetRecoilState(loadingAtom);
  const navigate = useNavigate();
  const mail = useRecoilValue(mailAtom);
  const role = useRecoilValue(roleAtom);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === repassword) {
      setLoad(true);
      const passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$_!])[A-Za-z\d@#$_!]{8,}$/;
      if (!passwordPattern.test(password)) {
        setLoad(false);
        toast.error(
          "password must contain [a-z],[A-Z],0-9 and @#$^_ with min 8 characters"
        );
        return;
      }
      const response =
        role === "rec"
          ? await axios.put("https://filmy-buffs-backend.vercel.app/recruiter/forgotpassword", {
              password: password,
              confirm: repassword,
              email: mail,
            })
          : await axios.put("https://filmy-buffs-backend.vercel.app/user/forgotpassword", {
              password: password,
              confirm: repassword,
              mailId: mail,
            });
      if (response.data.success) {
        toast.success("changed password successfully!");
        navigate("/signin");
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
    <div className="flex bg-gray-50 dark:bg-gray-900 flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
        <img
          className="w-8 h-8 mr-2"
          src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
          alt="logo"
        />
        FilmyBuffs
      </div>
      <div className="w-[25vw] bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <form
            className="space-y-4 md:space-y-6 flex flex-col"
            onSubmit={handleSubmit}
          >
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                placeholder="••••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="repassword"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                confirm password
              </label>
              <input
                type="password"
                name="repassword"
                id="repassword"
                value={repassword}
                onChange={(e) => {
                  setRePassword(e.target.value);
                }}
                placeholder="••••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="mx-auto rounded bg-neutral-50 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-neutral-800 shadow-[0_4px_9px_-4px_#cbcbcb] transition duration-150 ease-in-out hover:bg-neutral-100 hover:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] focus:bg-neutral-100 focus:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] focus:outline-none focus:ring-0 active:bg-neutral-200 active:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(251,251,251,0.3)] dark:hover:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)] dark:focus:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)] dark:active:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)]"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SetPassword;
