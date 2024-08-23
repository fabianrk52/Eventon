import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditProfile.css';
import Cookies from 'js-cookie';

const EditProfile = () => {
  const userID = Cookies.get('userId');

  const [formData, setFormData] = useState({
    cover_image: '',
    profile_image: '',
    last_name: '',
    email: '',
    phone_number: '',
    bio: '',
    supplier_category: '',
    location: '',
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
          cover_image: userData.cover_image || '',
          profile_image: userData.profile_image || '',
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          email: userData.email || '',
          phone_number: userData.phone_number || '',
          bio: userData.bio || '',
          location: userData.location || '',
          supplier_category: userData.supplier_category || '',
          reviews: userData.reviews || '',
          role: userData.role,
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to load user data.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userID]);

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(`http://localhost:65000/upload-image/${userID}/profile`, formData, {
        headers: {
          Authorization: `Bearer ${Cookies.get('userToken')}`,
          'Content-Type': 'multipart/form-data'  // Important for file uploads
        }
      });

      const base64Image = response.data.base64Image;
      alert('Profile image uploaded successfully');

      // Update the state with the uploaded profile image
      setFormData((prevFormData) => ({
        ...prevFormData,
        profile_image: base64Image,
      }));
    } catch (error) {
      alert('Error uploading profile image');
    }
  };

  const handleCoverImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(`http://localhost:65000/upload-image/${userID}/cover`, formData, {
        headers: {
          Authorization: `Bearer ${Cookies.get('userToken')}`,
          'Content-Type': 'multipart/form-data'  // Important for file uploads
        }
      });

      const base64Image = response.data.base64Image;
      alert('Cover image uploaded successfully');

      // Update the state with the uploaded cover image
      setFormData((prevFormData) => ({
        ...prevFormData,
        cover_image: base64Image,
      }));
    } catch (error) {
      alert('Error uploading cover image');
    }
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
      const profileData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone_number: formData.phone_number,
        bio: formData.bio,
        location:formData.location,
        supplier_category: formData.supplier_category,
      };

      await axios.put(`http://localhost:65000/user-profile/${userID}`, profileData, {
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
        <img src={`data:image/jpeg;base64,${formData.cover_image}`} alt="Cover" className="cover-photo" />
        <div className="upload-icon cover-upload">
          <label htmlFor="coverPhotoUpload">
            <i class="fa-solid fa-upload"></i>
          </label>
          <input
            type="file"
            id="coverPhotoUpload"
            name="cover_image"
            accept="image/*"
            onChange={handleCoverImageUpload}
          />
        </div>
      </div>
      <div className="profile-photo-container">
        <img src={`data:image/jpeg;base64,${formData.profile_image}`} alt="Profile" className="profile-photo" />
        <div className="upload-icon profile-upload">
          <label htmlFor="profilePhotoUpload">
            <i class="fa-solid fa-upload"></i>
          </label>
          <input
            type="file"
            id="profilePhotoUpload"
            name="profile_image"
            accept="image/*"
            onChange={handleProfileImageUpload}
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
        <label>Location </label>
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
        />
        {
          formData.role ? <>
            <label>Category</label>
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

            </select></> : <></>
        }
        <label>Reviews</label>
        <div className="read-only-reviews">
          {formData.reviews || 'No reviews available.'}
        </div>

        <button className="save-button" onClick={handleSave}>Save Changes</button>
      </div>
    </div>
  );
};

export default EditProfile;
