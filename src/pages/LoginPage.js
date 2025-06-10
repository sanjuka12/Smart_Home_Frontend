// src/LoginPage.js
import React, { useState, useRef } from 'react';
import './LoginPage.css';
import { FaEye, FaEyeSlash, FaTimesCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const firstName= useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const passwordRef = useRef(null);
  const navigate = useNavigate();

  const apiUrl = 'http://localhost:3000/api';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setPasswordError(false);

    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: username,
          password: password,
          firstName:firstName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Login successful
        console.log("Login success:", data);
        navigate('/dashboard', { state: { username,firstName: data.firstName } });
      } else {
        // ❌ Login failed
        if (response.status === 404) {
          setError('Username is not registered in the system.');
        } else if (response.status === 401) {
          setError('Incorrect Password! Please try again.');
          setPasswordError(true);
          passwordRef.current?.focus();
        } else {
          setError(data.message || 'Login failed. Please try again.');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Unable to connect to server. Please try again later.');
    }

try {
    const response = await fetch(`${apiUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName: username,
        password: password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Login success:", data);

      // ✅ After login success, send login log to /api/userlog
      await fetch(`${apiUrl}/userlog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: data.firstName,
          role: data.role, // Assuming backend returns user's role
        }),
      });

      // ✅ Navigate to dashboard with username and firstName
      navigate('/dashboard', { state: { username, firstName: data.firstName } });

    } else {
      if (response.status === 404) {
        setError('Username is not registered in the system.');
      } else if (response.status === 401) {
        setError('Incorrect Password! Please try again.');
        setPasswordError(true);
        passwordRef.current?.focus();
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    }
  } catch (err) {
    console.error('Login error:', err);
    setError('Unable to connect to server. Please try again later.');
  }


  };





  return (
    <div className="login-container">
      <div className="login-box">
        <img src="/assets/Dashboard.png" alt="Solar Logo" className="login-logo" />
        <h2 className="login-title">Solar Monitoring System</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            className="login-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              ref={passwordRef}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="show-password-btn"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>

          {error && (
            <div className="error-message">
              <FaTimesCircle className="error-icon" />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
