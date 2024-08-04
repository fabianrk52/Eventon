import React, { useState } from 'react';
import './Signup.css';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    role: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSignup = async () => {
    // Implement signup logic here, e.g., send formData to the server
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Sign up,</h2>
        <p>to start planning</p>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="select-field"
        >
          <option value="">Choose your role</option>
          <option value="organizer">Organizer</option>
          <option value="participant">Participant</option>
        </select>
        <input
          type="text"
          name="firstName"
          placeholder="First name"
          className="input-field"
          value={formData.firstName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last name"
          className="input-field"
          value={formData.lastName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone number"
          className="input-field"
          value={formData.phoneNumber}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="input-field"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="input-field"
          value={formData.password}
          onChange={handleChange}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          className="input-field"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        <button className="signup-button" onClick={handleSignup}>Sign Up</button>
        <p>You can also sign up with:</p>
        <div className="social-signup">
          <button className="social-button facebook">F</button>
          <button className="social-button google">G</button>
        </div>
        <p>Already have an account? <Link to="/" className="login-link">Login</Link></p>
      </div>
      <img src="/logo.png" alt="Eventon Logo" className="logo-image" />
    </div>
  );
};

export default Signup;
