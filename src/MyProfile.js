import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './MyProfile.css';

const MyProfile = () => {
  const userID = Cookies.get('userId');
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    cover_image: '',
    profile_image: '',  // Ensure this matches the field from the backend
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    bio: '',
    supplier_category: '',
    reviews: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:65000/user-profile/${userID}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get('userToken')}`  // Use token from cookies
          }
        });
        setUserData(response.data[0]);
        setLoading(false);
        console.log(userData);
      } catch (err) {
        setError('Failed to load user data.');
        setLoading(false);
      }

    };

    fetchUserData();
  }, [userID]);

  const handleEdit = () => {
    navigate(`/edit-profile`); // Navigate to the EditProfile page
  };

  // if (loading) {
  //   return <p>Loading...</p>;
  // }

  // if (error) {
  //   return <p>{error}</p>;
  // }

  return (
    <div className="my-profile-container">
      <div className="cover-photo-container">
        {userData.cover_image ? (
          <img src={`data:image/jpeg;base64,${userData.cover_image}`} alt="Cover" className="cover-photo" />
        ) : (
          <div className="placeholder">No Cover Photo</div>
        )}
      </div>
      <div className="profile-photo-container">
        {userData.profile_image ? (
          <img src={`data:image/jpeg;base64,${userData.profile_image}`} alt="Profile" className="profile-photo" />
        ) : (
          <div className="placeholder">No Profile Photo</div>
        )}
      </div>
      <div className="personal-info-container">
        <h2>{userData.first_name} {userData.last_name}</h2>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Phone:</strong> {userData.phone_number}</p>
        <p><strong>Bio:</strong> {userData.bio}</p>
        <p><strong>Category:</strong> {userData.supplier_category}</p>
        <p><strong>Reviews:</strong> {userData.reviews}</p>
        <button className="edit-button" onClick={handleEdit}>Edit Profile</button>
      </div>
    </div>
  );

};

export default MyProfile;
