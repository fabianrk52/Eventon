import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './PublicProfile.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Cookies from 'js-cookie';


const PublicProfile = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState({
    cover_image: '',
    profile_image: '',
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
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    message: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:65000/user-profile/${id}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get('userToken')}`,  // Use token from cookies
          }
        });
        setUserData(response.data[0]);
        console.log(response.data[0]);
        setLoading(false);
      } catch (err) {
        setError('Failed to load user data');
        setLoading(false);
      }
    };
    fetchUserData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:65000/send-message/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${Cookies.get('userToken')}`
        }
      });
      setShowContactForm(false);
      alert('Your message has been sent!');
    } catch (err) {
      alert('Failed to send your message');
    }
  };

  return (
    <div className="public-profile-container">
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
        <p><strong>Category:</strong> {userData.supplier_category}</p> {/* Display category */}
        <p><strong>Reviews:</strong> {userData.reviews}</p> {/* Display reviews */}
        <button onClick={() => setShowContactForm(true)} className="contact-button">
          Contact
        </button>
      </div>

      {showContactForm && (
        <div className="contact-form-overlay">
          <div className="contact-form-container">
            <h3>Contact {userData.name}</h3>
            <form onSubmit={handleSubmit}>
              <label>Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                required
              />
              <label>Surname</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
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
                name="phone_number"
                value={formData.phone_number}
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
                <button type="button" className="cancel-button-contact" onClick={() => setShowContactForm(false)}>Cancel</button>
                <button type="submit" className="submit-button" onClick={handleSubmit}>Send</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicProfile;
