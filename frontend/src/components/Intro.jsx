import React from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { needAtom } from "../recoil/needAtom";
import { Button } from "@mui/material";

function Intro() {
  const navigate = useNavigate();
  const setNeed = useSetRecoilState(needAtom);
  return (
    <div className="flex gap-6 bg-gray-900 h-screen w-screen justify-center items-center">
      <Button
        variant="contained"
        onClick={(e) => {
          e.preventDefault();
          navigate("/signin");
        }}
      >
        Signin
      </Button>
      <Button
        variant="contained"
        onClick={(e) => {
          e.preventDefault();
          setNeed("su n");
          navigate("/mail");
        }}
      >
        Get started!
      </Button>
    </div>
  );
}

export default Intro;
