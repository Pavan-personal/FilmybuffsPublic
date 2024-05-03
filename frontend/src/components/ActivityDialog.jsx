import React from "react";
import LocalPostOfficeIcon from "@mui/icons-material/LocalPostOffice";
import {
  Button,
  Dialog,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Input,
  Checkbox,
} from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { useRecoilValue } from "recoil";
import { profileAtom } from "../recoil/profileAtom";
import { HeartBroken } from "@mui/icons-material";

export default function ActivityDialog() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen((cur) => !cur);
  const profile = useRecoilValue(profileAtom);
  function getTimeDifference(dateString) {
    const postDate = new Date(dateString);
    const currentDate = new Date();

    const timeDifferenceInMilliseconds = currentDate - postDate;
    const timeDifferenceInSeconds = timeDifferenceInMilliseconds / 1000;

    const minutesAgo = Math.floor(timeDifferenceInSeconds / 60);

    if (minutesAgo < 60) {
      return `${minutesAgo} minutes ago`;
    } else if (minutesAgo < 24 * 60) {
      const hoursAgo = Math.floor(minutesAgo / 60);
      return `${hoursAgo} hours ago`;
    } else if (minutesAgo < 30 * 24 * 60) {
      const daysAgo = Math.floor(minutesAgo / (60 * 24));
      return `${daysAgo} days ago`;
    } else {
      const monthsAgo = Math.floor(minutesAgo / (60 * 24 * 30));
      return `${monthsAgo} months ago`;
    }
  }
  return (
    <>
      <Button
        onClick={handleOpen}
        variant="contained"
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
        Your Activity
      </Button>
      <Dialog
        open={open}
        onClose={handleOpen}
        className="bg-transparent shadow-none"
      >
        {localStorage.getItem("role") === "Recruiter" ? (
          <div className="grid grid-cols-2 h-fit divide-x-2 py-2 divide-slate-400">
            <div className="row-span-3 pt-6 flex justify-center items-center">
              <div className="absolute top-2 left-auto text-2xl p-1 font-bold text-gray-700">
                Followers
              </div>
              {profile.followersList.length > 0 ? (
                profile.followersList.map((flr) => {
                  return (
                    <div className="flex w-fit gap-0.5 items-center">
                      <img
                        src={
                          flr.profileImage ||
                          "https://www.pngall.com/wp-content/uploads/5/Profile-PNG-File.png"
                        }
                        className=" h-8"
                        alt=""
                        srcset=""
                      />
                      <div className=" font-normal">{flr.username}</div>
                    </div>
                  );
                })
              ) : (
                <div>No followers</div>
              )}
            </div>
            <div className="p-5 flex flex-col gap-2">
              <div className="flex gap-3">
                <div>Total Posts&nbsp;&nbsp;</div>
                <div className="flex justify-center items-center gap-1">
                  {profile.createdPosts.length}
                  <LocalPostOfficeIcon />
                </div>
              </div>
              <div className="flex gap-3">
                <div>Impressions</div>
                <div className="flex justify-center items-center gap-1">
                  {profile.engagement[0] + profile.engagement[1]}
                  <PeopleAltIcon />
                </div>
              </div>
              <div className="">
                Last post {getTimeDifference(profile.lastPost)}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col px-5 py-6 gap-5 text-xl">
            <div className="font-bold text-center text-[1.5rem] scal-[1.2]">
              Activity
            </div>
            <div className="w-full flex justify-between gap-6">
              <div>Following</div>{" "}
              <div className="flex justify-center items-center gap-1 font-semibold">
                {profile.following.length}
                <PeopleAltIcon />
              </div>
            </div>
            <div className="w-full flex justify-between gap-6">
              <div>Applied posts</div>{" "}
              <div className="flex justify-center items-center gap-1 font-semibold">
                {profile.appliedPosts.length}
                <LocalPostOfficeIcon />
              </div>
            </div>
            <div className="w-full flex justify-between gap-6">
              <div>Liked posts &nbsp;</div>
              <div className="flex justify-center items-center gap-1 font-semibold">
                {profile.likedPosts.length}
                <LocalPostOfficeIcon />
              </div>
            </div>
            <div className="w-full flex justify-between gap-6">
              <div> Success rate&nbsp;</div>
              {(profile.acceptedPosts.length * 100) /
                profile.appliedPosts.length +
                "%"}
            </div>
          </div>
        )}
      </Dialog>
    </>
  );
}
