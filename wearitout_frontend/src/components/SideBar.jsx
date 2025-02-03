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

const Sidebar = ({ open, toggleDrawer }) => {
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
          { icon: <ShoppingCart />, text: "Quản lý sản phẩm", to: "/shop-management" },
          { icon: <Assignment />, text: "Quản lý đơn hàng", to: "/order-management" },
          { icon: <People />, text: "Quản lý người dùng", to: "/user-management" }
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
