import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    coverPhoto: '',
    profilePhoto: '',
    name: '',
    email: '',
    phoneNumber: '',
    bio: '',
    freeText: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('https://your-api-endpoint.com/user'); // Replace with your API endpoint
        const userData = response.data;

        setFormData({
          coverPhoto: userData.coverPhoto || 'default-cover.jpg',
          profilePhoto: userData.profilePhoto || 'default-profile.jpg',
          name: userData.name || '',
          email: userData.email || '',
          phoneNumber: userData.phoneNumber || '',
          bio: userData.bio || '',
          freeText: userData.freeText || '',
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to load user data.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

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

export default EditProfile;
