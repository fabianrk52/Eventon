import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:65000/login', { email, password });
      if (response.status === 200) {
        const token = response.data.token;
        Cookies.set('userToken', token, { expires: 7 });
        Cookies.set('userId', response.data.userId, { expires: 7 });
        Cookies.set('userName', response.data.name, { expires: 7 });
        navigate('/login-2fa');
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
        <img src='/logo.png' alt="Logo" className="logo-image-login" />
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
        <button className="forgot-password">Forgot password?</button>
        <p>Or continue with:</p>
        <div className="social-login">
          <i class="fa-brands fa-facebook fa-xl"></i>
          <i class="fa-brands fa-google google fa-xl"></i>
        </div>
        <p>Not a member yet? <a href="/signup" className="signup-link">Sign up</a></p>
      </div>
    </div>
  );
};

export default Login;
