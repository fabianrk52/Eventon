import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import PublicProfile from './PublicProfile';
import Header from './Header';
import EventPage from './EventPage';
import LoginTwoFactorAuth from './Login-2FA';
import SignUpTwoFactorAuth from './SignUp-2FA';
import Cookies from 'js-cookie';
import EditProfile from './EditProfile';
import ServicesPage from './ServicesPage';
import EventonLandingPage from './EventonLandingPage';

const App = () => {
  const token = Cookies.get('userToken');

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup-2fa" element={token ? <SignUpTwoFactorAuth /> : <Login />} />
        <Route path="/profile/:id" element= {<PublicProfile />}/>
        <Route path="/edit-profile" element={token ? <EditProfile /> : <Login />} />
        <Route path="/" element={<EventonLandingPage/>}/>
        <Route path="/login" element={token ? <EventPage /> : <Login />} />
        <Route path="/events" element={<EventPage />} />
        <Route path="/services" element={<ServicesPage />} />
      </Routes>
    </Router>
  );
};

export default App;
