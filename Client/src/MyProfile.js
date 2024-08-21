import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './MyProfile.css';

const MyProfile = () => {
  const userID = Cookies.get('userID');
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    coverPhoto: '',
    profilePhoto: '',
    name: '',
    email: '',
    phoneNumber: '',
    bio: '',
    category: '',
    reviews: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/user-profile/${userID}`); // Replace with your actual API endpoint
        setUserData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load user data.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEdit = () => {
    navigate(`/edit-profile/${userID}`); // Navigate to the EditProfile page
  };

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   if (error) {
//     return <p>{error}</p>;
//   }

  return (
    <div className="my-profile-container">
      <div className="cover-photo-container">
        <img src={userData.coverPhoto} alt="Cover" className="cover-photo" />
      </div>
      <div className="profile-photo-container">
        <img src={userData.profilePhoto} alt="Profile" className="profile-photo" />
      </div>
      <div className="personal-info-container">
        <h2>{userData.name}</h2>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Phone:</strong> {userData.phoneNumber}</p>
        <p><strong>Bio:</strong> {userData.bio}</p>
        <p><strong>Category:</strong> {userData.category}</p>
        <p><strong>Reviews:</strong> {userData.reviews}</p>
        <button className="edit-button" onClick={handleEdit}>Edit Profile</button> {/* Edit button */}
      </div>
    </div>
  );
};

export default MyProfile;
