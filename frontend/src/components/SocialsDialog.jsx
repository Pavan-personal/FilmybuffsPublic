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

export default function SocialsDialog() {
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
    setHomeLoad(true);
    const response = await axios.post(
      `https://filmy-buffs-backend.vercel.app/${localStorage
        .getItem("role")
        .toLowerCase()}/modify`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.data.success) {
      toast.success(response.data.message);
      setHomeLoad(false);
    } else {
      setHomeLoad(false);
      toast.error(response.data.message);
    }
  };

  const [formData, setFormData] = useState({
    insta: profile.instagram,
    mobile: profile.mobileNumber,
    about: profile.about ? profile.about : "",
    twitter: profile.twitter,
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
        Enhance network
      </Button>
      <Dialog
        open={open}
        onClose={handleOpen}
        className="bg-transparent shadow-none"
      >
        <form
          style={{ padding: "1rem", overflowX: "hidden" }}
          onSubmit={handleSave}
          className="mx-auto w-[25vw] p-4"
        >
          <CardContent className="flex flex-col gap-2">
            <Typography variant="h7">Bio</Typography>
            <Input
              disabled={!editable}
              onChange={(e) => {
                setFormData({ ...formData, about: e.target.value });
              }}
              placeholder="tell about yourself"
              value={formData.about}
              size="large"
            />
            <Typography variant="h7">Mobile No</Typography>
            <Input
              disabled={!editable}
              placeholder="Enter you phone no"
              value={formData.mobile}
              onChange={(e) => {
                setFormData({ ...formData, mobile: e.target.value });
              }}
              type="number"
              size="large"
            />
            <Typography variant="h7">Instagram</Typography>
            <Input
              disabled={!editable}
              onChange={(e) => {
                setFormData({ ...formData, insta: e.target.value });
              }}
              placeholder="paste url 🔗"
              value={formData.insta}
              size="large"
            />
            <Typography variant="h7">Twitter</Typography>
            <Input
              disabled={!editable}
              value={formData.twitter}
              placeholder="paste url 🔗"
              onChange={(e) => {
                setFormData({ ...formData, twitter: e.target.value });
              }}
            />
          </CardContent>
          <div className="flex gap-6 justify-end p-4">
            {!editable && ( // Show "Edit Profile" button when inputs are not editable
              <Button
                variant="contained"
                style={{ textTransform: "capitalize" }}
                onClick={handleEditProfile}
              >
                Edit
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
