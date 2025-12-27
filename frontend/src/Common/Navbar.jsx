import { Drawer, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ DrawerList }) => {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (newOpen) => {
    setOpen(newOpen);
  };

  return (
    <div className="h-[10vh] flex items-center px-5 border-b border-gray-400">
      <div className="flex items-center gap-3">
        <IconButton onClick={() => toggleDrawer(true)} color="primary">
          <MenuIcon />
        </IconButton>

        <h1
          onClick={() => navigate("/")}
          className="logo text-xl cursor-pointer"
        >
          ToyVerse
        </h1>
      </div>

      <Drawer open={open} onClose={() => toggleDrawer(false)}>
        <DrawerList toggleDrawer={toggleDrawer} />
      </Drawer>
    </div>
  );
};

export default Navbar;
