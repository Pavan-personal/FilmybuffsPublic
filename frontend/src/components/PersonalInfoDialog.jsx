import React, { useState } from "react";
import { homeLoadAtom } from "../recoil/homeLoadAtom";
import toast from "react-hot-toast";
import {
  Button,
  Dialog,
  CardContent,
  Typography,
  Input,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { profileAtom } from "../recoil/profileAtom";
import axios from "axios";

export default function PersonalInfoDialog() {
  const [open, setOpen] = useState(false);
  const [editable, setEditable] = useState(false); // State to manage if inputs are editable or not
  const [showPassword, setShowPassword] = useState(false);
  const [profile, setProfile] = useRecoilState(profileAtom);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleOpen = () => {
    setOpen((cur) => !cur);
    open
      ? ""
      : setFormData({
          ...formData,
          username: profile.username,
          password: profile.password,
          mailId: profile.mailId,
        });
    setEditable(false); // Reset editable state when opening dialog
  };

  const handleEditProfile = () => {
    setEditable(true); // Enable inputs when editing profile
  };

  const setHomeLoad = useSetRecoilState(homeLoadAtom);

  const handleSave = async (e) => {
    e.preventDefault();
    // setEditable(false);
    // alert("hii");
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$_!])[A-Za-z\d@#$_!]{8,}$/;
    const usernamePattern = /^[a-zA-Z][a-zA-Z0-9_]{6,}$/;
    if (!usernamePattern.test(formData.username)) {
      toast.error(
        "username must start with [a-z] or [A-Z] and should only contain 0-9 or _ with min 6 characters"
      );
      return;
    }
    if (!passwordPattern.test(formData.password)) {
      toast.error(
        "password must contain alphabet,digits and @#$^_ with min 8 characters"
      );
      return;
    }
    setHomeLoad(true);
    const data = new FormData();
    data.append("newUsername", formData.username);
    data.append("newPassword", formData.password);
    data.append("newMailId", formData.mailId);
    formData.file ? data.append("file", formData.file) : "";
    const response = await axios.post(
      `https://filmy-buffs-backend.vercel.app/${localStorage
        .getItem("role")
        .toLowerCase()}/modify`,
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.data.success) {
      toast.success(response.data.message);
      setHomeLoad(false);
      // setTimeout(() => {
      //   setHomeLoad(false);
      // }, 1000);
    } else {
      setHomeLoad(false);
      toast.error(response.data.message);
    }
    // Disable inputs after saving changes
    // Add functionality to save changes here
  };

  const [formData, setFormData] = useState({
    username: profile.username,
    password: profile.password,
    about: profile.about ? profile.about : "",
    mailId: profile.mailId,
    file: null,
  });

  return (
    <>
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{
          fontFamily: '"Apple Color Emoji"',
        }}
        style={{
          borderRadius: "2rem",
          textTransform: "capitalize",
          backgroundColor: "rgb(30 ,64 ,175)",
          paddingTop: "0.5rem",
          paddingBottom: "0.5rem",
          fontWeight: 600,
          color: "rgb(226 ,255 ,255)",
          fontSize: "0.92rem",
        }}
        id="back-button"
        className="bg-blue-800 col-span-2 text-white px-6 py-2 rounded-full shadow-lg"
      >
        Personal Information
      </Button>
      <Dialog open={open} onClose={handleOpen} className="shadow-none">
        <form
          style={{ padding: "1rem", overflowX: "hidden" }}
          onSubmit={handleSave}
          className="mx-auto w-[25vw] p-4"
        >
          <CardContent className="flex flex-col gap-2">
            <div className="flex gap-2">
              {profile.profileImage ? (
                <img
                  class="w-24 h-24 rounded-full border-[3px]"
                  src={profile.profileImage}
                  alt=""
                />
              ) : (
                <img
                  class="w-24 h-24 rounded-full"
                  src="https://www.pngall.com/wp-content/uploads/5/Profile-PNG-File.png"
                  alt=""
                />
              )}
              <div className="flex flex-col gap-2 justify-center items-centerw-fit">
                <Typography
                  variant="h6"
                  style={{ fontWeight: "bolder" }}
                  className="font-bold"
                >
                  Personal Information
                </Typography>
                <input
                  class="block w-full scale-95 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-100 focus:outline-none dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400"
                  id="file_input"
                  onChange={(e) => {
                    setFormData({ ...formData, file: e.target.files[0] });
                  }}
                  disabled={!editable}
                  type="file"
                ></input>
              </div>
            </div>
            <Typography variant="h7">Email ID</Typography>
            <Input
              disabled={!editable}
              placeholder="Email"
              value={formData.mailId}
              required
              onChange={(e) => {
                setFormData({ ...formData, mailId: e.target.value });
              }}
              type="email"
              size="large"
            />
            <Typography variant="h7">Username</Typography>
            <Input
              disabled={!editable}
              required
              onChange={(e) => {
                setFormData({ ...formData, username: e.target.value });
              }}
              placeholder="Username"
              value={formData.username}
              size="large"
            />
            <Typography variant="h7">Password</Typography>
            <Input
              id="outlined-adornment-password"
              required
              disabled={!editable}
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
              }}
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    disabled={!editable}
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </CardContent>
          <div className="flex gap-6 justify-end p-4">
            {!editable && ( // Show "Edit Profile" button when inputs are not editable
              <Button
                variant="contained"
                style={{ textTransform: "capitalize" }}
                onClick={handleEditProfile}
              >
                Edit Profile
              </Button>
            )}
            {editable && ( // Show "Save" button when inputs are editable
              <Button
                variant="contained"
                type="submit"
                style={{ textTransform: "capitalize" }}
              >
                Save
              </Button>
            )}
          </div>
        </form>
      </Dialog>
    </>
  );
}
