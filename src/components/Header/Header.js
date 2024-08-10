import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
  const auth = JSON.parse(localStorage.getItem("Token")); // Parse the stored token to get the role
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("Token"); // Clear the specific token key
    navigate("/login", { replace: true }); // Replace the history entry with the login route
    window.location.reload(); // Force a full page reload to reset the state
};

  return (
    <div>
      {auth ? (
        <ul className='header-ul'>
          {/* Conditionally render links based on the user's role */}
          {auth.role === "admin" ? (
            <>
              <li><Link to='/admin/referral-codes'>See All Referral-Code</Link></li>
              <li><Link to='/admin/create-referral-code'>Generate Referral-Code</Link></li>
              <li><Link to='/admin/assign-referral-code'>Assign Referral-Code</Link></li>
            </>
          ) : (
            <>
              <li><Link to='/user/referral-codes'>Referral Codes</Link></li>
              {/* Add more user-specific links here */}
            </>
          )}
          <li><a href="/login" onClick={logout}>Logout</a></li>
        </ul>
      ) : (
        <ul className='header-ul header-right'>
          <li><Link to='/signup'>Sign Up</Link></li>
          <li><Link to='/login'>Login</Link></li>
        </ul>
      )}
    </div>
  );
}

export default Header;
