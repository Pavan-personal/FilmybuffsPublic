import * as React from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import EditNoteIcon from "@mui/icons-material/EditNote";
import EditPost from "./EditPost";
import { Tooltip } from "@mui/material";

export default function EditPostDrawer(props) {
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
      sx={{ width: "fit-content" }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <EditPost postId={props.postId} />
    </Box>
  );

  return (
    <div>
      {["right"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Tooltip title="edit">
            <EditNoteIcon
              id="back-button"
              onClick={toggleDrawer(anchor, true)}
              style={{
                color: "white",
                margin: "0.4rem",
                cursor: "pointer",
                scale: "1.3",
                zIndex: 0,
              }}
            />
          </Tooltip>
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
