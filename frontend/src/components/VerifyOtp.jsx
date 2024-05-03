import React from "react";
import { mailAtom } from "../recoil/mailAtom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { otpAtom } from "../recoil/otpAtom";
import toast from "react-hot-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadingAtom } from "../recoil/loadingAtom";
import { needAtom } from "../recoil/needAtom";

function VerifyOtp() {
  const [receivedOtp, setReceivedOtp] = useRecoilState(otpAtom);
  const navigate = useNavigate();
  const setLoad = useSetRecoilState(loadingAtom);
  const need = useRecoilValue(needAtom);
  const [otp, setOtp] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (parseInt(otp) === receivedOtp) {
      setLoad(true);
      navigate(need === "su n" ? "/choose" : "/setpsswd");
      setTimeout(() => {
        setLoad(false);
        toast.success("otp verified!");
      }, 1000);
    } else {
      setLoad(false);
      toast.error("incorrect otp");
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
      <div className="w-fit bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <form
            className="space-y-4 md:space-y-6 flex flex-col"
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <div>
              <label
                htmlFor="otp"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Enter otp received
              </label>
              <input
                type="text"
                name="otp"
                autoFocus
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                }}
                id="otp"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="mx-auto rounded bg-neutral-50 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-neutral-800 shadow-[0_4px_9px_-4px_#cbcbcb] transition duration-150 ease-in-out hover:bg-neutral-100 hover:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] focus:bg-neutral-100 focus:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] focus:outline-none focus:ring-0 active:bg-neutral-200 active:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(251,251,251,0.3)] dark:hover:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)] dark:focus:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)] dark:active:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)]"
            >
              Verify
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VerifyOtp;
