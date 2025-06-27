import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function GoogleSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");
    const email = query.get("email");
    const name = query.get("name");

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ email, name }));
      toast.success("Logged in with Google");
      navigate("/checkout"); 
    } else {
      toast.error("Google Login Failed");
      navigate("/signup");
    }
  }, [location, navigate]);

  return <p>Redirecting...</p>;
}

export default GoogleSuccess;
