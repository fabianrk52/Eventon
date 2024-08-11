import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './2FA.css';

const SignUpTwoFactorAuth = () => {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  const handleVerify = async () => {
    try {
      const token = Cookies.get('userToken');
      const response = await axios.post('/api/auth/activate-user', { token, code }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        // 2FA is successful, redirect to the dashboard or events page
        setMessage("Successful Login!");
        window.location.href = '/profile';
      } else {
        setMessage('Invalid 2FA code.');
      }
    } catch (error) {
      setMessage('Verification failed. Please try again.');
    }
  };

  const handleResendCode = async () => {
    try {
      const token = Cookies.get('userToken');
      await axios.post('/api/resend-2fa', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage('A new 2FA code has been sent.');
    } catch (error) {
      setMessage('Failed to resend 2FA code. Please try again.');
    }
  };

  return (
    <div className="twofa-container">
      <div className="twofa-box">
        <h2>Sign Up</h2>
        <h3>Two-Factor Authentication</h3>
        <input
          type="text"
          placeholder="Enter your 2FA code"
          className="input-field"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button className="verify-button" onClick={handleVerify}>Verify</button>
        {message && <p className="message">{message}</p>}
        <a href="#" className="resend-link" onClick={handleResendCode}>Resend code</a>
      </div>
    </div>
  );
};

export default SignUpTwoFactorAuth;
