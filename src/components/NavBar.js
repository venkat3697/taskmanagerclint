// src/components/AppBar.js
import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";
const NavBar = () => {
  const {userId} = useUser()
  const isAuthenticated = userId?true:false;

  const handleLogout = async () => {
    // const googleLogoutUrl = "https://accounts.google.com/logout";
    localStorage.removeItem("token"); // Clear the token
    // Optional: Open Google logout URL
    // window.open(googleLogoutUrl, "_blank", "width=500,height=600");

    // Redirect to the login page or home page
    window.location.href = "/login"; // Adjust the URL based on your app's structure
    // navigate("/login"); // Redirect to login page
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" component="div">
            Task Manager
          </Typography>
          <Box>
            {/* <Button color="inherit" component={Link} to="/">
              Home
            </Button> */}

            {isAuthenticated ? (
              <>
                <Button color="inherit" component={Link} to="/dashboard">
                  Dashboard
                </Button>
                <Button color="inherit" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login">
                  Login
                </Button>
                <Button color="inherit" component={Link} to="/signup">
                  SignUp
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default NavBar;
