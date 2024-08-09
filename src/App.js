import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import UserProfile from './UserProfile';
import PublicProfile from './PublicProfile';
import Header from './Header';

const App = () => {
  const mockUser = {
    coverPhoto: '/cover-photo.jpg',
    profilePhoto: '/profile-photo.jpg',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    phoneNumber: '987-654-3210',
    bio: 'This is a brief bio about Jane Doe.',
  };

  return (
    <Router>
      <Header/>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/user/:id" element={<PublicProfile user={mockUser} />} />
        <Route path="/" element={<Login />} />
        <Route path="/events" element={<div>Events Page</div>} />
        <Route path="/signin" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
