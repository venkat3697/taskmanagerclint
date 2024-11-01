import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { mainUrl } from "../api";

export const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleGoogleLogin = () => {
    // Redirect to the backend Google login route
    // window.location.href = "http://localhost:5000/api/auth/google"; // Adjust this URL as necessary
    window.location.href = `${mainUrl}api/auth/google`
  };

  const handleLogin = async (event) => {
    event.preventDefault(); // Prevents page reload on submit

    try {
      const response = await axios.post(
        // "http://localhost:5000/auth/login",
        `${mainUrl}auth/login`,
        formData
      );

      console.log("Login successful:", response.data);
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "100vh",
          justifyContent: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography
            variant="h5"
            component="h1"
            align="center"
            gutterBottom
            sx={{
              color: "#1976D2",
              fontWeight: "bold",
              letterSpacing: 1.5,
            }}
          >
            Login
          </Typography>
          <form onSubmit={handleLogin}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.password}
              onChange={handleChange}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              type="submit"
            >
              Login
            </Button>
          </form>
          <Button
            variant="outlined"
            startIcon={<GoogleIcon sx={{ color: "#4285F4" }} />}
            color="inherit"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleGoogleLogin}
          >
            Sign in with Google
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};
