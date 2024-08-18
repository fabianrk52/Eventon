import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import Cookies from 'js-cookie';

const Header = () => {
  const navigate = useNavigate();
  const token = Cookies.get('userToken');
  const userName = Cookies.get('userName'); // Assuming the user's name is stored in a cookie

  const [showDropdown, setShowDropdown] = useState(false);

  const handleSignOut = () => {
    Cookies.remove('userToken');
    Cookies.remove('userName');
    navigate('/login');
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleCategorySelect = (category) => {
    if (category === 'All') {
      navigate(`/services`);
    }
    else {
      navigate(`/services?category=${category}`);
    }
    navigate(0);
    setShowDropdown(false);
  };

  return (
    <header className="header">
      <div className="header-left">
        <img src='/logo.png' alt="App Logo" className="header-logo" />
        <nav className="header-nav">
          <Link to="/">Home</Link>
          <Link to="/events">Events</Link>
          <div className="dropdown">
            <button className="dropdown-button" onClick={toggleDropdown}>
              Services
            </button>
            {showDropdown && (
              <div className="dropdown-menu">
                <button onClick={() => handleCategorySelect('All')}>All</button>
                <button onClick={() => handleCategorySelect('Catering')}>Catering</button>
                <button onClick={() => handleCategorySelect('Decoration')}>Decoration</button>
                <button onClick={() => handleCategorySelect('Music')}>Music</button>
                <button onClick={() => handleCategorySelect('Photography')}>Photography</button>
                <button onClick={() => handleCategorySelect('Hall')}>Hall</button>
              </div>
            )}
          </div>
          <Link to="/my-profile">Profile</Link>
          <Link to="/supplier-messages" className="header-messages-link">Inquiries</Link> {/* New Link */}
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
