import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './MyProfile.css';

const MyProfile = () => {
  const userID = Cookies.get('userId');
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    coverPhoto: '',
    profilePhoto: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    bio: '',
    supplier_category: '',
    reviews: '',
  });
  console.log(userData);
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
        <h2>{userData.first_name} {userData.last_name}</h2>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Phone:</strong> {userData.phone_number}</p>
        <p><strong>Bio:</strong> {userData.bio}</p>
        <p><strong>Category:</strong> {userData.supplier_category}</p>
        <p><strong>Reviews:</strong> {userData.reviews}</p>
        <button className="edit-button" onClick={handleEdit}>Edit Profile</button> {/* Edit button */}
      </div>
    </div>
  );
};

export default MyProfile;
