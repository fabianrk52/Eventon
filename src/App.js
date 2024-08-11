import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import PublicProfile from './PublicProfile';
import Header from './Header';
import EventPage from './EventPage';
import LoginTwoFactorAuth from './Login-2FA';  // Import the 2FA component
import SignUpTwoFactorAuth from './SignUp-2FA';  // Import the 2FA component
import Cookies from 'js-cookie';
import EditProfile from './EditProfile';

const App = () => {
  const token = Cookies.get('userToken');

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup-2fa" element={token ? <SignUpTwoFactorAuth /> : <Login/>} />  {/* 2FA Route */}
        <Route path="/profile:id" element={token ? <PublicProfile/> : <Login />} /> {/* Public Profile Route */}
        <Route path="/edit-profile" element={token ? <EditProfile /> : <Login />} /> {/* Edit Profile Route */}
        <Route path="/" element={token ? <EventPage /> : <Login />} />
        <Route path="/events" element={token ? <EventPage /> : <Login />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/login-2fa" element={token ? <LoginTwoFactorAuth /> : <Login/>} />  {/* 2FA Route */}
      </Routes>
    </Router>
  );
};

export default App;
