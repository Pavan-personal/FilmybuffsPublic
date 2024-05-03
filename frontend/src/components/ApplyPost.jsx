import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import {
  Button,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { homeLoadAtom } from "../recoil/homeLoadAtom";
function ApplyPost(props) {
  const setHomeLoad = useSetRecoilState(homeLoadAtom);
  const [application, setApplication] = useState({
    portfolio: undefined,
    description: undefined,
    file: undefined,
  });
  const [visisble, setVisible] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    var count = 0;
    const formData = new FormData();
    application.portfolio
      ? formData.append("portfolio", application.portfolio)
      : (count += 1);
    application.description
      ? formData.append("description", application.description)
      : 1;
    application.file ? formData.append("file", application.file) : (count += 1);

    if (count === 0) {
      toast.error("Can't upload both file and link");
      return;
    } else if (count === 2) {
      toast.error("Please upload any document");
      return;
    }
    formData.append("factor", "p");
    setHomeLoad(true);
    // console.log(props.postId);
    const response = await axios.post(
      `https://filmy-buffs-backend.vercel.app/user/apply/${props.postId}`,
      formData,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response.data.success) {
      setTimeout(() => {
        setHomeLoad(false);
        toast.success(response.data.message);
        setApplication({
          portfolio: undefined,
          description: undefined,
          file: null,
        });
      }, 1500);
    } else {
      setHomeLoad(false);
      toast.error(response.data.message);
    }
  };
  return (
    <div className="dark:bg-[#082f49] bg p-5 flex justify-center items-center w-fit h-screen">
      <div className=" py-9 rounded-xl p-6">
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          Apply to Post
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 w-80 sm:gap-6">
            <div className="sm:col-span-2 relative">
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Description
              </label>
              <div
                className={`absolute scale-[0.8] right-10 -bottom-28 ${
                  visisble ? "" : "hidden"
                }`}
              >
                <Picker
                  data={data}
                  previewPosition="none"
                  onEmojiSelect={(e) => {
                    const res = application.description + e.native;
                    setApplication({ ...application, description: res });
                  }}
                />
              </div>
              <textarea
                id="description"
                required
                value={application.description}
                onChange={(e) => {
                  setApplication({
                    ...application,
                    description: e.target.value,
                  });
                }}
                className="block p-2.5 w-full text-sm text-gray-900 h-24 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Your description here (optional)"
              ></textarea>
              <div
                className="bg-black"
                onClick={() => {
                  setVisible(!visisble);
                }}
              >
                <EmojiEmotionsIcon className="text-gray-500 top-9 right-2 dark:text-gray-400 absolute" />
              </div>
            </div>
            <div className="w-full flex flex-col gap-2 sm:col-span-2 ">
              <label
                for="website"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Provide Links here
              </label>
              <input
                type="url"
                onChange={(e) => {
                  setApplication({ ...application, portfolio: e.target.value });
                }}
                id="website"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="paste your file links here"
              />
            </div>
            <div className="w-full flex flex-col gap-2 sm:col-span-2 ">
              <label
                for="file-input"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Upload photo/video here
              </label>
              <input
                type="file"
                name="file-input"
                id="file-input"
                onChange={(e) => {
                  setApplication({
                    ...application,
                    file: e.target.files[0] ? e.target.files[0] : undefined,
                  });
                }}
                className="block w-full cursor-pointer border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600
                file:bg-gray-50 file:border-0
                file:me-4
                file:py-3 file:px-4
                dark:file:bg-gray-700 dark:file:text-gray-400"
              />
            </div>
          </div>
          <div className="flex justify-end pt-6 items-center gap-4">
            <Button
              onClick={(e) => {
                e.preventDefault();
                setApplication({
                  ...application,
                  portfolio: "",
                  description: "",
                  attachment: null,
                });
              }}
              type="button"
              id="back-button"
              variant="contained"
            >
              Back
            </Button>
            <Button type="submit" variant="contained">
              Apply
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApplyPost;
