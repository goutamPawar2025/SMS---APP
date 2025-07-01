import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import UploadCsv from "./pages/UploadCsv";
import GoogleSuccess from "./pages/GoogleSuccess";
import AuthCallback from "./pages/AuthCallback";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";


import Dashboard from "./components/Dashboard";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import QuickSms from "./components/QuickySms";
import Emails from "./components/Emails"
import Template from "./components/Template"
import Packages from "./components/Packages"
import Contact from "./components/Contact"



const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        
        <Routes>
       <Route
  path="/signup"
  element={
    <PublicRoute>
      <Signup />
    </PublicRoute>
  }
/>

<Route
  path="/login"
  element={
    <PublicRoute>
      <Login />
    </PublicRoute>
  }
/>

          <Route path="/google_success" element={<GoogleSuccess />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
         
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <UploadCsv />
              </ProtectedRoute>
            }
          />
            <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />


          <Route
            path="/quicksms"
            element={
              <ProtectedRoute>
                <QuickSms />
              </ProtectedRoute>
            }
          />

           <Route
            path="/bulk-emails"
            element={
              <ProtectedRoute>
                <Emails />
              </ProtectedRoute>
            }
          />

             <Route
            path="/templates"
            element={
              <ProtectedRoute>
                <Template />
              </ProtectedRoute>
            }
          />
            <Route
            path="/packages"
            element={
              <ProtectedRoute>
                <Packages />
              </ProtectedRoute>
            }
          />



                 <Route
            path="/contacts"
            element={
              <ProtectedRoute>
                <Contact />
              </ProtectedRoute>
            }
          />




        </Routes>
      </Router>

      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="dark"
        transition={Bounce}
      />
    </ThemeProvider>
  );
}

export default App;
