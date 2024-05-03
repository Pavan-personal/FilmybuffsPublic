import { useState } from "react";
import "./App.css";
import Signup from "./components/Signup";
import MailId from "./components/MailId";
import VerifyOtp from "./components/VerifyOtp";
import { GridLoader, MoonLoader } from "react-spinners";
import { Route, Routes } from "react-router-dom";
import Signin from "./components/Signin";
import ChooseRole from "./components/ChooseRole";
import Home from "./components/Home";
import Intro from "./components/Intro";
import { useRecoilValue } from "recoil";
import { loadingAtom } from "./recoil/loadingAtom";
import Resetpsswd from "./components/Resetpsswd";
import SetPassword from "./components/SetPassword";
import { profileAtom } from "./recoil/profileAtom";
import MainHome from "./components/MainHome";

function App() {
  const load = useRecoilValue(loadingAtom);
  const profile = useRecoilValue(profileAtom);
  return (
    <div>
      {load ? (
        <div className="h-screen flex justify-center items-center">
          <GridLoader color="#36d7b7" />
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="home" element={<Home />}>
            <Route path="posts" element={<MainHome />} />
          </Route>
          <Route path="mail" element={<MailId />} />
          <Route path="verifyotp" element={<VerifyOtp />} />
          <Route path="signup" element={<Signup />} />
          <Route path="signin" element={<Signin />} />
          <Route path="choose" element={<ChooseRole />} />
          <Route path="forgot" element={<Resetpsswd />} />
          <Route path="setpsswd" element={<SetPassword />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
