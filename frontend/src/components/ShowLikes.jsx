import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import axios from "axios";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function ShowLikes(props) {
  const [likeLoad, setLikeLoad] = React.useState(false);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

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
          Liked by
        </DialogTitle>
        <DialogContent dividers style={{ padding: 0 }}>
          <div className="p-4 rounded-xl flex flex-col gap-3">
            {props.likes.length > 0 ? (
              props.likes.map((user, index) => (
                <div className="flex items-center gap-1" key={index}>
                  {user.profileImage ? (
                    <img
                      className="w-12 border-2 border-gray-500 h-12 rounded-full mr-2"
                      src={user.profileImage}
                      alt=""
                    />
                  ) : (
                    <div className="relative mr-2 w-12 h-12 overflow-hidden bg-gray-100 rounded-full scale-95  dark:bg-gray-600">
                      <svg
                        className="absolute w-[3.625rem] h-[3.625rem] text-gray-400 -left-1"
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
                  <div>
                    <div className="text-[1.05rem]">{user.username}</div>
                    user
                  </div>
                </div>
              ))
            ) : (
              <div>No likes yet!</div>
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
