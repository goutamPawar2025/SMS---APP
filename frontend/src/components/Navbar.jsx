import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Box,
  InputBase,
  Avatar,
  Chip,
  Button,
} from "@mui/material";
import {
  Dashboard,
  Sms,
  Settings,
  Payment,
  Contacts,
  Help,
  Search,
  Logout,
} from "@mui/icons-material";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import * as jwt from "jwt-decode";

const drawerWidth = 240;

const menuItems = [
  { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
  { text: "Quick SMS", icon: <Sms />, path: "/quicksms" },
  { text: "Send Emails", icon: <MarkEmailReadIcon />, path: "/bulk-emails" },
  { text: "Templates", icon: <AddToPhotosIcon />, path: "/templates" },
 
  { text: "Mail Packages", icon: <Payment />, path: "/packages" },
  { text: "Contacts", icon: <Contacts />, path: "/contacts" },
  { text: "Help", icon: <Help />, path: "/help" },
];

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const [credits, setCredits] = useState(0);
  const [lastPlan, setlastPlan] = useState("No Active Plan");


  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const fetchCredits = async () => {
    try {
      const token = localStorage.getItem("token");
      const decoded = jwt.jwtDecode(token);
      const userId = decoded.user_id;

      if (!userId) return;
 
      const response = await axios.get(
        `http://localhost:3000/api/subscriptions/${userId}`
      );

        if(!response) return;

      const plans = response.data.plans || ["No Active Plan"];
        const lastPlan = plans.length > 0 ? plans[plans.length - 1] : null;
           setlastPlan(lastPlan)


      const activeSub = response.data.total_credits;
      setCredits(activeSub ? activeSub : 0);
    } catch (error) {
      console.error("Error fetching credits:", error);
    }
  };

  useEffect(() => {
    fetchCredits();
    const interval = setInterval(fetchCredits, 5000);
    return () => clearInterval(interval);
  },[]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          bgcolor: "#fff",
          color: "#000",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight="bold">
            SMS Application
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #ccc",
                px: 1,
                borderRadius: 2,
              }}
            >
              <Search sx={{ mr: 1 }} />
              <InputBase placeholder="Search..." />
            </Box>

 {credits === 0 && lastPlan !== null ? (
        <Button
          variant="outlined"
          color="success"
          onClick={() => navigate('/packages')}
          sx={{ mt: 0 }}
        >
          Buy Premium
        </Button>
      ) : (
        <Chip
          label={`${lastPlan !== null ? lastPlan : "Loading..."}`}
          color="success"
        />
      )}

      <Chip
        label={`Credits: ${credits !== null ? credits : "Loading..."}`}
        color="warning"
        sx={{ ml: 1 }}
      />
            <Avatar alt="User" />
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<Logout />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#f9fafb",
            borderRight: "1px solid #ddd",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ px: 2, pt: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            SMS APPLICATION
          </Typography>
          <List>
            {menuItems.map((item) => (
              <NavLink
                key={item.text}
                to={item.path}
                style={({ isActive }) => ({
                  textDecoration: "none",
                  color: isActive ? "#1976d2" : "#333",
                })}
              >
                <ListItem
                  button
                  selected={window.location.pathname === item.path}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              </NavLink>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "#f4f6f8",
          p: 3,
          minHeight: "100vh",
          mt: 8,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
