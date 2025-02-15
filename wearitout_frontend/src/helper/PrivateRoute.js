import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PrivateRoute = ({ element }) => {
  const { isAuthenticated, checkAuthentication } = useAuth(); // Lấy checkAuthentication từ context

  useEffect(() => {
    checkAuthentication();  // Kiểm tra lại trạng thái đăng nhập khi render lại component
  }, []);

  // Nếu người dùng đã đăng nhập, render component được truyền vào (element), nếu không, chuyển hướng đến /account (đăng nhập)
  return isAuthenticated ? element : <Navigate to="/account" />;
};

export default PrivateRoute;
