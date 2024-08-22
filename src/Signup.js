import React, { useState } from 'react';
import './Signup.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';


const Signup = () => {
  const [formData, setFormData] = useState({
    role: 'EventPlanner',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
    supplierCategory: 'None'
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    console.log(formData);
  };

  const handleSignup = async () => {
    const { role, firstName, lastName, phoneNumber, email, password, supplierCategory } = formData;

    if (!role || !firstName || !lastName || !phoneNumber || !email || !password || (role === "Supplier" && !supplierCategory)) {
      setMessage('Please complete all fields.');
      return;
    }
  
    console.log(formData);
    try {
      const response = await axios.post('http://localhost:65000/register', formData);
      if (response.status === 200) {
        const token = response.data.token;

        navigate('/signup-2fa');
      }
      if (response.status === 201) {
        setMessage(`${response.message}`);
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
          <option value="EventPlanner">Event Planner</option>
          <option value="Supplier">Supplier</option>
        </select>
        {formData.role === "Supplier" && (
          <select
            name="supplierCategory"
            value={formData.supplierCategory}
            onChange={handleChange}
            className="select-field"
          >
            <option value="None">Choose Supplier Category</option>
            <option value="Catering">Catering</option>
            <option value="Decoration">Decoration</option>
            <option value="Music">Music</option>
            <option value="Photography">Photography</option>
            <option value="Hall">Hall</option>
          </select>
        )}
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
          <i class="fa-brands fa-facebook fa-xl"></i>
          <i class="fa-brands fa-google google fa-xl"></i>
        </div>
        <p>Already have an account? <Link to="/" className="login-link">Login</Link></p>
      </div>
    </div>
  );
};

export default Signup;
