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
    navigate('/login-2fa');
    try {
      const response = await axios.post('/api/login', { email, password });
      if (response.status === 200) {
        const token = response.data.token;
        Cookies.set('userToken', token, { expires: 7 });

        // Redirect to the public profile page
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
          <i class="fa-brands fa-facebook"></i>
          <i class="fa-brands fa-google google"></i>
        </div>
        <p>Not a member yet? <a href="/signup" className="signup-link">Sign up</a></p>
      </div>
    </div>
  );
};

export default Login;
