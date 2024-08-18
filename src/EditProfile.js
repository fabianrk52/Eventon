import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditProfile.css';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';

const EditProfile = () => {
  const userID = Cookies.get('userID');
  const { id } = useParams();

  const [formData, setFormData] = useState({
    coverPhoto: '',
    profilePhoto: '',
    name: '',
    email: '',
    phoneNumber: '',
    bio: '',
    category: '',
    reviews: '', // Read-only reviews field
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([
    {'value':"Catering",'name':"Catering"},
    {'value':"Decoration",'name':"Decoration"},
    {'value':"Music",'name':"Music"},
    {'value':"Photography",'name':"Photography"},
    {'value':"Hall",'name':"Hall"},
  ]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/user-profile/${userID}`); // Replace with your actual API endpoint
        const userData = response.data;
        setFormData({
          coverPhoto: userData.coverPhoto || 'default-cover.jpg',
          profilePhoto: userData.profilePhoto || 'default-profile.jpg',
          name: userData.name || '',
          email: userData.email || '',
          phoneNumber: userData.phoneNumber || '',
          bio: userData.bio || '',
          category: userData.category || '',
          reviews: userData.reviews || '',
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to load user data.');
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories'); // Replace with your actual categories API endpoint
        setCategories(response.data);
      } catch (err) {
        setError('Failed to load categories.');
      }
    };

    fetchUserData();
    fetchCategories();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    try {
      await axios.put(`/api/user-profile/${userID}`, formData); // Update API endpoint
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Failed to update profile.');
    }
  };

  // if (loading) {
  //   return <p>Loading...</p>;
  // }

  // if (error) {
  //   return <p>{error}</p>;
  // }

  return (
    <div className="edit-profile-container">
      <div className="cover-photo-container">
        <img src={formData.coverPhoto} alt="Cover" className="cover-photo" />
      </div>
      <div className="profile-photo-container">
        <img src={formData.profilePhoto} alt="Profile" className="profile-photo" />
      </div>
      <div className="personal-info-container">
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <label>Phone Number</label>
        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
        />

        <label>Bio</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
        />

        <label>Category</label> {/* Dropdown for selecting categories */}
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="">Select a Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>

        <label>Reviews</label> {/* Display reviews as read-only */}
        <div className="read-only-reviews">
          {formData.reviews || 'No reviews available.'}
        </div>

        <button className="save-button" onClick={handleSave}>Save Changes</button>
      </div>
    </div>
  );
};

export default EditProfile;
