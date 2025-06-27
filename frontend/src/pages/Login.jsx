// src/pages/Login.jsx
import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Link as MuiLink,
  Paper,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/users/sign_in", {
        user: { email, password },
      });

      const token = res.data.token;
      console.log("Received token:", token);

      if (token) {
        localStorage.setItem("token", token);
      }

      toast.success(res.data.status.message || "Login successful!");
      navigate("/dashboard ");
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Login failed. Please try again.";
      toast.error(msg);
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Login to Your Account
        </Typography>

        <Box component="form" onSubmit={handleLogin} noValidate>
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            Login
          </Button>
        </Box>

        <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
          Don't have an account?{" "}
          <MuiLink component={Link} to="/signup">
            Sign up here
          </MuiLink>
        </Typography>
      </Paper>
    </Container>
  );
}

export default Login;
