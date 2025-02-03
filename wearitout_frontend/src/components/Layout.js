import React, { useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "./SideBar";

const Layout = ({ children }) => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar component */}
      <Sidebar open={open} toggleDrawer={toggleDrawer} />

      {/* Main content area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginLeft: 0, // Chỉnh lại marginLeft về 0 để không có khoảng cách thừa
          padding: 2,
          height: '100vh', // Đảm bảo nội dung chiếm toàn bộ chiều cao của màn hình
          overflow: 'auto', // Tránh tràn nội dung
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
