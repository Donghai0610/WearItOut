import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

// PrivateRoute is now simplified: we use it only to conditionally render based on authentication status
const PrivateRoute = ({ element }) => {
  const { isAuthenticated } = useAuth(); // Check authentication state

  // If user is authenticated, render the passed component (element), otherwise redirect to /account
  return isAuthenticated ? element : <Navigate to="/account" />;
};

export default PrivateRoute;
