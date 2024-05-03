import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { roleAtom } from "../recoil/roleAtom";
import { loadingAtom } from "../recoil/loadingAtom";

function ChooseRole() {
  const [role, setRole] = useRecoilState(roleAtom);

  const setLoad = useSetRecoilState(loadingAtom);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad(true);
    navigate("/signup");
    setTimeout(() => {
      setLoad(false);
    }, 1000);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col h-screen justify-center items-center gap-4"
    >
      <div className="text-4xl p-2 font-bold">Choose your role!</div>
      <div
        className="flex gap-8 justify-center
     items-center"
      >
        <div className="w-72 bg-slate-200 flex justify-center items-center border-2 border-slate-400 p-4 flex-col gap-3 rounded-2xl">
          <img
            src="https://clipground.com/images/black-business-man-clipart-png-4.png"
            className="h-72 brightness-[2"
            alt=""
          />
          <button
            className="relative inline-flex items-center justify-center px-10 py-4 overflow-hidden font-mono font-medium tracking-tighter text-white bg-gray-800 rounded-lg group"
            type="submit"
            onClick={(e) => {
              setRole("R");
            }}
          >
            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-green-500 rounded-full group-hover:w-56 group-hover:h-56"></span>
            <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-700"></span>
            <span className="relative">Recruiter</span>
          </button>
        </div>
        <div className="w-72 flex justify-center items-center border-2 border-slate-400 p-4 flex-col gap-3 rounded-2xl">
          <img
            src="https://static.vecteezy.com/system/resources/previews/009/349/226/non_2x/3d-render-smartphone-with-checklist-application-free-png.png"
            className="h-72"
            alt=""
          />
          <button
            className="relative inline-flex items-center justify-center px-10 py-4 overflow-hidden font-mono font-medium tracking-tighter text-white bg-gray-800 rounded-lg group"
            type="submit"
            onClick={(e) => {
              setRole("A");
            }}
          >
            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-green-500 rounded-full group-hover:w-56 group-hover:h-56"></span>
            <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-700"></span>
            <span className="relative">Applicant</span>
          </button>
        </div>
      </div>
    </form>
  );
}

export default ChooseRole;
