import { Button, Tooltip } from "@mui/material";
import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { session1Atom } from "../recoil/session1Atom";
import { homeLoadAtom } from "../recoil/homeLoadAtom";
import ProfileDrawer from "./Profile.drawer";
import AddPostDrawer from "./AddPost.drawer";
import { searchAtom } from "../recoil/searchAtom";

function Navbar(props) {
  const [session1, setSession1] = useRecoilState(session1Atom);
  const navigate = useNavigate();
  const [search, setSearch] = useRecoilState(searchAtom);
  const setHomeLoad = useSetRecoilState(homeLoadAtom);
  return (
    <nav className=" w-[80%]/ z-10 h-[13vh] sticky top-0 flex items-center py-6 justify-evenly dark:bg-gray-900/">
      <div className="flex flex-wrap gap-7 items-center">
        <Link to="/home/posts" className="flex items-center gap-2">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-12"
            alt="FilmyBuffs Logo"
          />
          <span className="self-center text-3xl font-bold whitespace-nowrap dark:text-white">
            FilmyBuffs
          </span>
        </Link>
        <div className="relative flex items-center justify-center w-72">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="text"
            id="search-navbar"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search..."
          />
        </div>
      </div>
      <div className="flex justify-center gap- items-center">
        {localStorage.getItem("role") === "Recruiter" ? <AddPostDrawer /> : ""}
        <ProfileDrawer />
        {session1 ? (
          <Tooltip title="logout from this account">
            <Button
              variant="contained"
              className="scale-90"
              onClick={props.handleLogout}
              color="error"
              style={{
                fontSize: "0.9rem",
                paddingLeft: "8px",
                paddingRight: "8px",
                paddingTop: "5px",
                paddingBottom: "4px",
                textTransform: "capitalize",
                fontWeight: "bold",
                marginLeft: "0.5rem",
              }}
            >
              Logout
            </Button>
          </Tooltip>
        ) : (
          <Tooltip title="signin into your account">
            <Button
              variant="contained"
              className="scale-90"
              onClick={(e) => {
                e.preventDefault();
                setSession1(true);
                navigate("/signin");
                setHomeLoad(false);
              }}
              color="primary"
              style={{
                fontSize: "0.9rem",
                paddingLeft: "8px",
                paddingRight: "8px",
                paddingTop: "5px",
                paddingBottom: "4px",
                textTransform: "capitalize",
                fontWeight: "bold",
              }}
            >
              Signin
            </Button>
          </Tooltip>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
