import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    if (!token) {
      setIsValid(false);
      return;
    }

    axios
      .get('http://localhost:3000/api/validate_token', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setIsValid(true);
      })
      .catch(() => {
        localStorage.removeItem('token');
        setIsValid(false);
      });
  }, [token]);

  if (isValid === null) return <div>Checking token...</div>;
  if (!isValid) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
