import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import Cookies from 'js-cookie';

const Header = () => {
  const navigate = useNavigate();
  const token = Cookies.get('userToken');
  const userName = Cookies.get('userName'); // Assuming the user's name is stored in a cookie

  const handleSignOut = () => {
    Cookies.remove('userToken');
    Cookies.remove('userName');
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-left">
        <img src='logo.png' alt="App Logo" className="header-logo" />
        <nav className="header-nav">
          <Link to="/">Home</Link>
          <Link to="/events">Events</Link>
          <Link to="/services">Services</Link>
          <Link to="/my-profile">Profile</Link>
        </nav>
      </div>
      <div className="header-user-container">
        {token ? (
          <>
            <span className="header-username">{userName}</span>
            <button className="header-signout-button" onClick={handleSignOut}>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="header-auth-link">Login</Link>
            <Link to="/signup" className="header-auth-link">Sign Up</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
