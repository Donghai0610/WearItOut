import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useSelector((state) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/account" />;  // Nếu chưa đăng nhập, chuyển hướng về trang login
    }

    return children;  // Nếu đã đăng nhập, render các route bảo vệ
};

export default ProtectedRoute;
