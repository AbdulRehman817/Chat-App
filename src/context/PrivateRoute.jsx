import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PrivateRoute = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    // Show a loading indicator while checking auth state
    return <div>Loading...</div>;
  }

  return currentUser ? <Outlet /> : <Navigate to="/signin" />;
};

export default PrivateRoute;
