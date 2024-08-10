import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function PrivateComponent({ role }) {
  const auth = JSON.parse(localStorage.getItem("Token")); // Parse the stored token

  // If there is no auth object, redirect to login
  if (!auth) {
    return <Navigate to="/login" />;
  }

  // If a role is specified and the role doesn't match, redirect to login
  if (role && auth.role !== role) {
    return <Navigate to="/login" />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
}

export default PrivateComponent;
