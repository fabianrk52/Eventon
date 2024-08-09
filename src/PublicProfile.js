import React from 'react';
import './PublicProfile.css';

const PublicProfile = ({ user }) => {
  return (
    <div className="public-profile-container">
      <div className="cover-photo-container">
        <img src={user.coverPhoto} alt="Cover" className="cover-photo" />
        <div className="profile-photo-container">
          <img src={user.profilePhoto} alt="Profile" className="profile-photo" />
        </div>
      </div>
      <div className="personal-info-container">
        <h2>{user.name}</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phoneNumber}</p>
        <p><strong>Bio:</strong> {user.bio}</p>
      </div>
    </div>
  );
};

export default PublicProfile;
