import * as React from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import AddBoxIcon from "@mui/icons-material/AddBox";
import AddPost from "./AddPost";
import { IconButton } from "@mui/material";

export default function AddPostDrawer() {
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
      <AddPost handleToggle={toggleDrawer} />
    </Box>
  );

  return (
    <div>
      <React.Fragment key={"right"}>
        <IconButton id="back-button" onClick={toggleDrawer("right", true)}>
          <AddBoxIcon
            style={{
              fontSize: "2.4rem",
              color: "white",
              zIndex: -1,
            }}
          />
        </IconButton>
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
