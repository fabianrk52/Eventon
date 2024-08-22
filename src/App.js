import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import PublicProfile from './PublicProfile';
import Header from './Header';
import EventPage from './EventPage';
import LoginTwoFactorAuth from './Login-2FA';
import SignUpTwoFactorAuth from './SignUp-2FA';
import Cookies from 'js-cookie';
import MyProfile from './MyProfile';
import ServicesPage from './ServicesPage';
import EventonLandingPage from './EventonLandingPage';
import EditProfile from './EditProfile';
import SupplierMessagesPage from './SupplierMessagePage';

const App = () => {
  const token = Cookies.get('userToken');

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup-2fa" element={<SignUpTwoFactorAuth />} />
        <Route path="/login-2fa" element={<LoginTwoFactorAuth />} />
        <Route path="/profile/:id" element={token ? <PublicProfile /> : <Navigate to="/" />} />
        <Route path="/my-profile" element={token ? <MyProfile /> : <Navigate to="/" />} />
        <Route path="/" element={<EventonLandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/events" element={token ? <EventPage /> : <Navigate to="/" />} />
        <Route path="/services" element={token ? <ServicesPage /> : <Navigate to="/" />} />
        <Route path="/edit-profile/:id" element={token ? <EditProfile /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to='/' />} />
        <Route path="/supplier-messages" element={token ? <SupplierMessagesPage /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
