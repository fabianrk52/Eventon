import React, { useState } from 'react';
import './Signup.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';



const Signup = () => {
  const [formData, setFormData] = useState({
    role: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSignup = async () => {
    // Redirect to the 2FA page
    navigate('/signup-2fa');
    try {
      const response = await axios.post('/api/signup', { formData });
      if (response.status === 200) {
        const token = response.data.token;

        // Store the token in a cookie
        // Cookies.set('userToken', token, { expires: 7 });

        // Redirect to the 2FA page
        navigate('/signup-2fa');

      } else {
        setMessage('Invalid login credentials.');
      }
    } catch (error) {
      setMessage('Login failed. Please check your credentials.');
    }
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
          <option value="EventPlanner">Event Planner</option>
          <option value="EventCustomer">Customer</option>
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
        {message && <p className="message">{message}</p>}
        <p>You can also sign up with:</p>
        <div className="social-signup">
          <i class="fa-brands fa-facebook"></i>
          <i class="fa-brands fa-google google"></i>
        </div>
        <p>Already have an account? <Link to="/" className="login-link">Login</Link></p>
      </div>
    </div>
  );
};

export default Signup;
