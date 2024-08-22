import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditProfile.css';
import Cookies from 'js-cookie';

const EditProfile = () => {
  const userID = Cookies.get('userId');

  const [formData, setFormData] = useState({
    coverPhoto: '/cover-profile.jpg',
    profilePhoto: '/dslr-camera.png',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    bio: '',
    supplierCategory: '',
    reviews: '', // Read-only reviews field
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [supplierCategory, setCategories] = useState([
    { 'value': "Catering", 'name': "Catering" },
    { 'value': "Decoration", 'name': "Decoration" },
    { 'value': "Music", 'name': "Music" },
    { 'value': "Photography", 'name': "Photography" },
    { 'value': "Hall", 'name': "Hall" },
  ]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:65000/user-profile/${userID}`); // Replace with your actual API endpoint
        const userData = response.data;
        setFormData({
          coverPhoto: userData.coverPhoto || 'default-cover.jpg',
          profilePhoto: userData.profilePhoto || 'default-profile.jpg',
          first_name: userData.name || '',
          last_name: userData.name || '',
          email: userData.email || '',
          phone_number: userData.phoneNumber || '',
          bio: userData.bio || '',
          supplierCategory: userData.supplierCategory || '',
          reviews: userData.reviews || '',
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to load user data.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userID]);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    // Handle file upload logic here (e.g., preview, uploading to server, etc.)
    setFormData({
      ...formData,
      [name]: URL.createObjectURL(file), // Preview the image locally
    });
  };

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
        <div className="upload-icon cover-upload">
          <label htmlFor="coverPhotoUpload">
            <i class="fa-solid fa-upload"></i>
          </label>
          <input
            type="file"
            id="coverPhotoUpload"
            name="coverPhoto"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      </div>
      <div className="profile-photo-container">
        <img src={formData.profilePhoto} alt="Profile" className="profile-photo" />
        <div className="upload-icon profile-upload">
          <label htmlFor="profilePhotoUpload">
            <i class="fa-solid fa-upload"></i>
          </label>
          <input
            type="file"
            id="profilePhotoUpload"
            name="profilePhoto"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      </div>
      <div className="personal-info-container">
        <label>Name</label>
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
        />
        <label>Surname</label>
        <input
          type="text"
          name="last_name"
          value={formData.last_name}
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
          {supplierCategory.map((supplierCategory) => (
            <option key={supplierCategory.id} value={supplierCategory.name}>
              {supplierCategory.name}
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
