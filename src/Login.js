import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './Login.css';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/login', { email, password });
      if (response.status === 200) {
        const token = response.data.token;

        // Store the token in a cookie
        Cookies.set('userToken', token, { expires: 7 }); // Expires in 7 days

        // Redirect to the events page or another protected route
        window.location.href = '/events';
      } else {
        setMessage('Invalid login credentials.');
      }
    } catch (error) {
      setMessage('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <input
          type="email"
          placeholder="Email"
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="login-button" onClick={handleLogin}>Login</button>
        {message && <p className="message">{message}</p>}
        <a href="#" className="forgot-password">Forgot password?</a>
        <p>Or continue with:</p>
        <div className="social-login">
          <button className="social-button facebook">F</button>
          <button className="social-button google">G</button>
        </div>
        <p>Not a member yet? <Link to="/signup" className="signup-link">Sign up</Link></p>
      </div>
      <div className="welcome-box">
        <img src="/logo.png" alt="Eventon Logo" className="logo-image-login" />
        <p>Where vision meets execution,</p>
        <p>Your event planning partner.</p>
        <div className="logo">Eventon</div>
        <a href="#" className="contact-link">Contact us</a>
      </div>
    </div>
  );
};

export default Login;
