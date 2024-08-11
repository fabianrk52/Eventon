import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import UserProfile from './UserProfile';
import PublicProfile from './PublicProfile';
import Header from './Header';
import EventPage from './EventPage';
import Cookies from 'js-cookie';

const App = () => {
  const token = Cookies.get('userToken');

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile/:id" element={<UserProfile />} />
        <Route path="/user/:id" element={<PublicProfile />} />
        <Route path="/" element={token ? <EventPage /> : <Login />} />
        <Route path="/events" element={token ? <EventPage /> : <Login />} />
        <Route path="/signin" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
