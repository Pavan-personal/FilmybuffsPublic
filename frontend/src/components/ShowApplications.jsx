import * as React from "react";
import toast, { Toaster } from "react-hot-toast";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { Tooltip } from "@mui/material";
import DialogContent from "@mui/material/DialogContent";
import LinkIcon from "@mui/icons-material/Link";
import DialogActions from "@mui/material/DialogActions";
import ModalImage from "react-modal-image";
import axios from "axios";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { homeLoadAtom } from "../recoil/homeLoadAtom";
import { profileAtom } from "../recoil/profileAtom";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function ShowApplications(props) {
  const setHomeLoad = useSetRecoilState(homeLoadAtom);
  const checkList = [];
  props.selections.forEach((sel) => {
    checkList.push(sel.username);
  });
  const profile = useRecoilValue(profileAtom);
  const [temp, setTemp] = React.useState(false);
  const [videoOpen, setVideoOpen] = React.useState(false);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const getFileExtension = (url) => {
    return url.split(".").pop().toLowerCase();
  };
  const imgUrls = ["jpg", "jpeg", "png", "gif", "webp"];
  const mp4Urls = ["mp4", "mov", "avi", "mkv"];

  return (
    <React.Fragment>
      <Button variant="text" onClick={handleClickOpen}>
        View
      </Button>

      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Applications
        </DialogTitle>
        <DialogContent
          dividers
          style={{
            height: "fit-content",
            maxHeight: "60vh",
          }}
        >
          <div className="overscroll-y-contain">
            {profile.createdPosts.includes(props.postId) ? (
              props.applications.length > 0 ? (
                <ul
                  role="list"
                  className="divide-y rounded-xl bg-gray-900 p-6 divide-gray-200 dark:divide-gray-400"
                >
                  {props.applications.map((user) => {
                    return (
                      <Tooltip
                        title={user.description}
                        className="py-3 sm:py-4 flex flex-col gap-4"
                      >
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            {user.profileImage ? (
                              <img
                                className="w-8 h-8 scale-[1.1] rounded-full"
                                src={user.profileImage}
                                alt="profile"
                              />
                            ) : (
                              <div className="relative w-8 h-8 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                                <svg
                                  className="absolute w-10 h-10 text-gray-400 -left-1"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fillrlue="evenodd"
                                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                    cliprlue="evenodd"
                                  ></path>
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0 ms-3">
                            <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                              {user.username}
                            </p>

                            <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                              {user.mail}
                            </p>
                          </div>
                          <div className="ml-10">
                            {user.attachment ? (
                              imgUrls.includes(
                                getFileExtension(user.attachment)
                              ) ? (
                                <ModalImage
                                  small="https://www.pngall.com/wp-content/uploads/2018/05/Files-High-Quality-PNG.png"
                                  className="h-8"
                                  large={user.attachment}
                                  alt="image"
                                />
                              ) : mp4Urls.includes(
                                  getFileExtension(user.attachment)
                                ) ? (
                                ""
                              ) : (
                                <LinkIcon
                                  className="cursor-pointer"
                                  onClick={() =>
                                    (window.location.href = user.attachment)
                                  }
                                  style={{ color: "grey", fontSize: "2rem" }}
                                />
                              )
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                        <div className="">
                          {user.attachment &&
                          mp4Urls.includes(
                            getFileExtension(user.attachment)
                          ) ? (
                            <video
                              className="h-[10rem] w-fit rounded-xl"
                              controls
                              src={user.attachment}
                            />
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="flex gap-3 justify-self-end self-end">
                          {!props.blockList.includes(user.username) ? (
                            <Button
                              style={{
                                fontSize: "0.7rem",
                                padding: "2px",
                                backgroundColor: "red",
                              }}
                              onClick={async (e) => {
                                e.preventDefault();
                                setHomeLoad(true);
                                const response = await axios.delete(
                                  `https://filmy-buffs-backend.vercel.app/recruiter/block/${user.username}`,
                                  {
                                    headers: {
                                      Authorization: `Bearer ${localStorage.getItem(
                                        "token"
                                      )}`,
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
                              }}
                              variant="contained"
                            >
                              block
                            </Button>
                          ) : (
                            <Button
                              style={{
                                color: "white",
                                fontSize: "0.6rem",
                                padding: "2px",
                                backgroundColor: "red",
                              }}
                              onClick={async (e) => {
                                e.preventDefault();
                                setHomeLoad(true);
                                const response = await axios.delete(
                                  `https://filmy-buffs-backend.vercel.app/recruiter/block/${user.username}`,
                                  {
                                    headers: {
                                      Authorization: `Bearer ${localStorage.getItem(
                                        "token"
                                      )}`,
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
                              }}
                            >
                              unblock
                            </Button>
                          )}
                          {checkList.includes(user.username) ? (
                            <Button
                              style={{ fontSize: "0.7rem", padding: "2px" }}
                              variant="contained"
                            >
                              hired
                            </Button>
                          ) : (
                            <Button
                              color="success"
                              variant="contained"
                              style={{ fontSize: "0.6rem", padding: "2px" }}
                              onClick={async (e) => {
                                e.preventDefault();

                                setHomeLoad(true);
                                const response = await axios.post(
                                  "https://filmy-buffs-backend.vercel.app/recruiter/select",
                                  {
                                    sname: user.username,
                                    postId: props.postId,
                                  },
                                  {
                                    headers: {
                                      Authorization: `Bearer ${localStorage.getItem(
                                        "token"
                                      )}`,
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
                              }}
                            >
                              accept
                            </Button>
                          )}
                        </div>
                      </Tooltip>
                    );
                  })}
                </ul>
              ) : (
                <div className="">No applicants yet!</div>
              )
            ) : (
              <div>Permission denied</div>
            )}
          </div>
        </DialogContent>

        <DialogActions
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button autoFocus onClick={handleClose}>
            close
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
