import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { Menu, Dashboard, ShoppingCart, Assignment, People, ExitToApp } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { ShellIcon } from "lucide-react";

const Sidebar = ({ open, toggleDrawer }) => {
  const role = localStorage.getItem("role"); // Get role from localStorage

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? 240 : 80,
        transition: "width 0.3s",
        flexShrink: 0,
        backgroundColor: '#FFF0E5',
        '& .MuiDrawer-paper': {
          width: open ? 240 : 80,
          transition: "width 0.3s",
          backgroundColor: '#FFF0E5',
          position: 'relative',
        },
      }}
    >
      <List>
        <ListItemButton onClick={toggleDrawer}>
          <ListItemIcon>
            <Menu />
          </ListItemIcon>
        </ListItemButton>
        <Divider />
        {[{ icon: <Dashboard />, text: "Dashboard", to: "/dashboard" },
          { icon: <ShellIcon />, text: "Quản lý sản phẩm", to: "/shop-management" },
          { icon: <Assignment />, text: "Quản lý đơn bán", to: "/order-management" },
          { icon: <ShoppingCart />, text: "Quản lý đơn mua", to: "/order-user" },
        ].map((item, index) => (
          <ListItem key={index} disablePadding>
            <Link to={item.to} style={{ textDecoration: 'none', color: 'inherit' }}>
              <ListItemButton>
                <ListItemIcon>{item.icon}</ListItemIcon>
                {open && <ListItemText primary={item.text} />}
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
        
        {/* Only show 'User Management' if the user is an admin */}
        {role === "ADMIN" && (
          <ListItem disablePadding>
            <Link to="/user-management" style={{ textDecoration: 'none', color: 'inherit' }}>
              <ListItemButton>
                <ListItemIcon>
                  <People />
                </ListItemIcon>
                {open && <ListItemText primary="Quản lý người dùng" />}
              </ListItemButton>
            </Link>
          </ListItem>
        )}
        
        <Divider />
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <ExitToApp />
            </ListItemIcon>
            {open && <ListItemText primary="Logout" />}
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
