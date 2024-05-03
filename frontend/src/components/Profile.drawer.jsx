import * as React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import EditNoteIcon from "@mui/icons-material/EditNote";
import EditPost from "./EditPost";
import { IconButton } from "@mui/material";
import Profile from "./Profile";

export default function ProfileDrawer(props) {
  const [state, setState] = React.useState({
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event && event.target.id === "back-button") {
      setState({ ...state, [anchor]: open });
    } else {
      return;
    }
  };

  const list = (anchor) => (
    <Box
      role="presentation"
      sx={{
        width: "fit-content",
        height: "100%",
        padding: "2rem",
        backgroundColor: "rgb(17 ,24 ,39)",
        // backgroundColor: "red",
      }}
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <Profile />
    </Box>
  );

  return (
    <div>
      {["right"].map((anchor) => (
        <React.Fragment key={anchor}>
          <IconButton id="back-button" onClick={toggleDrawer(anchor, true)}>
            <AccountCircleIcon
              style={{ color: "white", fontSize: "2.4rem", zIndex: -1 }}
            />
          </IconButton>
          <SwipeableDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            {list(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </div>
  );
}
