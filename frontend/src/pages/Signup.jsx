import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../api/axios";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/users", {
        user: { email, password, password_confirmation },
      });
      toast.success("Signup successful!");
      navigate("/login");
    } catch (error) {
      const errors = error.response?.data?.status?.errors || ["Signup failed"];
      errors.forEach((msg) => toast.error(msg));
    }
  };

const handleGoogleRedirect = () => {
window.location.href = "http://localhost:3000/users/auth/google_oauth2";
};


  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div
        className="row shadow bg-white rounded-4 overflow-hidden"
        style={{ maxWidth: "760px", width: "100%" }}
      >
        <div className="col-md-6 p-4 d-flex flex-column justify-content-center align-items-center bg-info text-white text-center">
          <h5>Connect With Your Audience</h5>
          <h6>With Single Click</h6>
          <img
            src="src/assets/images.jpeg"
            alt="Mobile UI"
            className="img-fluid mt-4"
            style={{ maxHeight: "300px" }}
          />
        </div>

        <div className="col-md-6 p-4">
          <h4 className="mb-4 fw-bold">SMS APPLICATION</h4>
          <h6 className="mb-3">Create account</h6>
          <form onSubmit={handleSignup}>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Gmail address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Confirm password"
                value={password_confirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
              />
            </div>

            <div className="form-check mb-3">
              <input
                type="checkbox"
                className="form-check-input"
                id="agree"
                required
              />
              <label className="form-check-label" htmlFor="agree">
                I agree to all the <a href="#">Terms</a> and{" "}
                <a href="#">Privacy policy</a>
              </label>
            </div>

            <button type="submit" className="btn btn-success w-100 mb-2">
              Create account
            </button>

            <button
              type="button"
              className="btn btn-danger w-100 mb-2"
              onClick={handleGoogleRedirect}
            >
              Sign in with Google
            </button>

            <p className="text-center mt-3">
              Already have an account? <a href="/login">Log in</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
