import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { Button } from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { homeLoadAtom } from "../recoil/homeLoadAtom";

export default function AddPost(props) {
  const setHomeLoad = useSetRecoilState(homeLoadAtom);
  const [post, setPost] = useState({
    title: undefined,
    category: "actor",
    description: undefined,
    attachment: undefined,
  });
  const [visisble, setVisible] = useState(false);
  console.log("hey  ", post);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setHomeLoad(true);
    const formData = new FormData();
    formData.append("title", post.title);
    formData.append("description", post.description);
    formData.append("category", post.category);
    post.attachment ? formData.append("file", post.attachment) : "";

    const response = await axios.post(
      "https://filmy-buffs-backend.vercel.app/recruiter/publish",
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
        setPost({
          title: "",
          description: "",
          attachment: undefined,
        });
        props.handleToggle("right", false);
        document.getElementById("file-input").value = null;
      }, 1500);
    } else {
      setHomeLoad(false);
      toast.error(response.data.message);
    }
  };
  return (
    <div className="dark:bg-[#082f49] p-5 flex justify-center items-center w-fit h-[100vh]">
      <div className=" py-9 rounded-xl p-6">
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          Add a new post
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 w-80 sm:gap-6">
            <div className="col-span-2">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Post Title*
              </label>
              <input
                type="text"
                name="title"
                value={post.title}
                onChange={(e) => {
                  setPost({ ...post, title: e.target.value });
                }}
                id="title"
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Type your post title"
              />
            </div>

            <div className="col-span-2 relative">
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Post Description*
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
                    const res = post.description + e.native;
                    setPost({ ...post, description: res });
                  }}
                />
              </div>
              <textarea
                id="description"
                rows="8"
                required
                value={post.description}
                onChange={(e) => {
                  setPost({ ...post, description: e.target.value });
                }}
                className="block p-2.5 w-full text-sm text-gray-900 h-32 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Your description here"
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

            <div className="w-full sm: col-span-2">
              <label
                htmlFor="category"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Category*
              </label>
              <select
                id="category"
                required
                value={post.category}
                onChange={(e) => {
                  setPost({ ...post, category: e.target.value });
                }}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              >
                <option value="update">update</option>
                <option value="actor">actor</option>
                <option value="camera">Technician</option>
                <option value="singer">singer</option>
                <option value="dancer">dancer</option>
                <option value="Musician">Music</option>
              </select>
            </div>

            <div className="w-full flex flex-col gap-2 sm:col-span-2 ">
              <label htmlFor="file-input" className="text-white cursor-pointer">
                Choose file
              </label>
              <input
                type="file"
                name="file-input"
                id="file-input"
                onChange={(e) => {
                  setPost({
                    ...post,
                    attachment: e.target.files[0]
                      ? e.target.files[0]
                      : undefined,
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
                setPost({
                  ...post,
                  postId: "",
                  title: "",
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
              Post
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
