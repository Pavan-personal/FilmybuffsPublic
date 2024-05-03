import * as React from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Tooltip } from "@mui/material";
import { useRecoilState } from "recoil";
import toast from "react-hot-toast";
import axios from "axios";
import { homeLoadAtom } from "../recoil/homeLoadAtom";

export default function BasicMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [homeLoad, setHomeLoad] = useRecoilState(homeLoadAtom);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  return (
    <div>
      <Tooltip title="options">
        <MoreVertIcon
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          style={{ color: "gray", fontSize: "1.4rem" }}
        />
      </Tooltip>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        autoFocus={false}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleDelete}>delete</MenuItem>
      </Menu>
    </div>
  );
}
