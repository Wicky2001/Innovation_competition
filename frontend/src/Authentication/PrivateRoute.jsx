import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import axios from "axios";

axios.defaults.withCredentials = true;

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Initialize as null to handle loading state
  const { isAuthenticatedAction } = useAuth();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const res = await isAuthenticatedAction();
  
        setIsAuthenticated(res);
      } catch (error) {
        console.error("Error in checkAuthentication:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []);

  // Show loading state while authentication status is being checked
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }
  // Render children if authenticated, otherwise navigate to login
  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/" />
  );
};


export default PrivateRoute;
