import * as React from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import AddBoxIcon from "@mui/icons-material/AddBox";
import AddPost from "./AddPost";
import { IconButton } from "@mui/material";
import ApplyPost from "./ApplyPost";

export default function ApplyPostDrawer(props) {
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
      sx={{ width: "100%" }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <ApplyPost postId={props.postId} />
    </Box>
  );

  return (
    <div>
      <React.Fragment key={"right"}>
        <button id="back-button" onClick={toggleDrawer("right", true)}>
          Apply
        </button>
        <SwipeableDrawer
          anchor={"right"}
          open={state["right"]}
          onClose={toggleDrawer("right", false)}
          onOpen={toggleDrawer("right", true)}
        >
          {list("right")}
        </SwipeableDrawer>
      </React.Fragment>
    </div>
  );
}
