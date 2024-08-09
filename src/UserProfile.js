import React, { useState } from 'react';
import './UserProfile.css';

const UserProfile = () => {
  const [formData, setFormData] = useState({
    coverPhoto: 'cover-profile.webp',
    profilePhoto: 'dslr-camera.png',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phoneNumber: '123-456-7890',
    bio: 'This is a brief bio about John Doe.',
    freeText: 'Add your thoughts here...',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="user-profile-container">
      <div className="cover-photo-container">
        <img src={formData.coverPhoto} alt="Cover" className="cover-photo" />
      </div>
      <div className="profile-photo-container">
        <img src={formData.profilePhoto} alt="Profile" className="profile-photo" />
      </div>
      <div className="personal-info-container">
        <h2>{formData.name}</h2>
        <p><strong>Email:</strong> {formData.email}</p>
        <p><strong>Phone:</strong> {formData.phoneNumber}</p>
        <p><strong>Bio:</strong> {formData.bio}</p>
      </div>
      <div className="free-text-container">
        <h3>Your Thoughts</h3>
        <textarea
          name="freeText"
          value={formData.freeText}
          onChange={handleChange}
          className="free-text"
        ></textarea>
      </div>
    </div>
  );
};

export default UserProfile;
