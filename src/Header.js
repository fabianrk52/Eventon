import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <nav className="header-nav">
        <Link to="/">Home</Link>
        <Link to="/events">Events</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/signup">Sign Up</Link>
      </nav>
      <div className="header-logo-container">
        <img src="/logo.png" alt="Eventon Logo" />
      </div>
    </header>
  );
};

export default Header;
