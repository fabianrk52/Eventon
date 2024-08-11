import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams , useNavigate } from 'react-router-dom';
import './Profile.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const PublicProfile = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState({
    coverPhoto: '',
    profilePhoto: '',
    name: '',
    email: '',
    phoneNumber: '',
    bio: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/user-profile/${id}`); // Replace with your actual API endpoint
        setUserData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load user data');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="public-profile-container">
      <div className="cover-photo-container">
        <img src={userData.coverPhoto} alt="Cover" className="cover-photo" />
      </div>
      <i
        className="fas fa-edit edit-profile-icon"
        onClick={handleEditProfile}
        title="Edit Profile"
      ></i>
      <div className="profile-photo-container">
        <img src={userData.profilePhoto} alt="Profile" className="profile-photo" />
      </div>
      <div className="personal-info-container">
        <h2>{userData.name}</h2>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Phone:</strong> {userData.phoneNumber}</p>
        <p><strong>Bio:</strong> {userData.bio}</p>
      </div>
    </div>
  );
};

export default PublicProfile;
