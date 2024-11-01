import React, { useState } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { mainUrl } from "../api";

export const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(""); // Error state for password mismatch
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return; // Stop form submission if passwords don't match
    }

    setError(""); // Clear error if passwords match

    try {
      const response = await axios.post(
        // "http://localhost:5000/auth/register",
        `${mainUrl}auth/register`,
        formData
      );
      console.log("Register user successful", response.data);
      alert("Register user successful");
      navigate("/login");
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
            Register
          </Typography>
          {/* Display error if passwords don't match */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleRegister}>
            <TextField
              label="Username"
              name="username"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.username}
              onChange={handleChange}
            />
            <TextField
              label="Email"
              name="email"
              variant="outlined"
              fullWidth
              margin="normal"
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
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              type="submit"
            >
              Signup
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};
