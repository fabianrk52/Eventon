import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditProfile.css';
import Cookies from 'js-cookie';

const EditProfile = () => {
  const userID = Cookies.get('userId');

  const [formData, setFormData] = useState({
    coverPhoto: '',
    profilePhoto: '',
    last_name: '',
    email: '',
    phone_number: '',
    bio: '',
    supplier_category: '',
    reviews: '', // Read-only reviews field
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [supplier_category, setCategories] = useState([
    { 'value': "Catering", 'name': "Catering" },
    { 'value': "Decoration", 'name': "Decoration" },
    { 'value': "Music", 'name': "Music" },
    { 'value': "Photography", 'name': "Photography" },
    { 'value': "Hall", 'name': "Hall" },
  ]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:65000/user-profile/${userID}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get('userToken')}`  // Use token from cookies
          }
        });
        const userData = response.data[0];
        setFormData({
          coverPhoto: userData.coverPhoto || '',
          profilePhoto: userData.profilePhoto || '',
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          email: userData.email || '',
          phone_number: userData.phone_number || '',
          bio: userData.bio || '',
          supplier_category: userData.supplier_category || '',
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
      await axios.put(`http://localhost:65000/user-profile/${userID}`, formData, {
        headers: {
          Authorization: `Bearer ${Cookies.get('userToken')}`
        }
      });
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
          name="phone_number"
          value={formData.phone_number}
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
          {supplier_category.map((supplier_category) => (
            <option key={supplier_category.id} value={supplier_category.name}>
              {supplier_category.name}
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
