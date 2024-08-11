import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import UserProfile from './UserProfile';
import PublicProfile from './PublicProfile';
import Header from './Header';
import EventPage from './EventPage';
import LoginTwoFactorAuth from './Login-2FA';  // Import the 2FA component
import SignUpTwoFactorAuth from './SignUp-2FA';  // Import the 2FA component

import Cookies from 'js-cookie';

const App = () => {
  const token = Cookies.get('userToken');

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={token ? <EventPage /> : <Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup-2fa" element={token ? <SignUpTwoFactorAuth /> : <Login/>} />  {/* 2FA Route */}
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/user/:id" element={<PublicProfile />} />
        <Route path="/events" element={token ? <EventPage /> : <Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login-2fa" element={token ? <LoginTwoFactorAuth /> : <Login/>} />  {/* 2FA Route */}
      </Routes>
    </Router>
  );
};

export default App;
