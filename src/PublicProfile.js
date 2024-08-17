import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './PublicProfile.css';
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
  const [showContactForm, setShowContactForm] = useState(false); // State to control popup visibility
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const response = await axios.get(`/api/user-profile/${id}`); // Replace with your actual API endpoint
  //       setUserData(response.data);
  //       setLoading(false);
  //     } catch (err) {
  //       setError('Failed to load user data');
  //       setLoading(false);
  //     }
  //   };

  //   fetchUserData();
  // }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/send-request/${id}`, formData); // Replace with your actual API endpoint
      setShowContactForm(false); // Close the popup after submission
      alert('Your request has been sent!');
    } catch (err) {
      alert('Failed to send your request');
    }
  };

  // if (loading) {
  //   return <p>Loading...</p>;
  // }

  // if (error) {
  //   return <p>{error}</p>;
  // }

  return (
    <div className="public-profile-container">
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
        <button onClick={() => setShowContactForm(true)} className="contact-button">
          Contact
        </button>
      </div>

      {/* Contact Form Popup */}
      {showContactForm && (
        <div className="contact-form-overlay">
          <div className="contact-form-container">
            <h3>Contact {userData.name}</h3>
            <form onSubmit={handleSubmit}>
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <label>Phone</label>
              <input
                type="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
              <label>Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
              />
              <div className="contact-form-buttons">
                <button type="button" className="cancel-button" onClick={() => setShowContactForm(false)}>Cancel</button>
                <button type="submit" className="submit-button">Send</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicProfile;
