// src/pages/Home.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
  try {
    const res = await axios.post('http://localhost:8000/auth/jwt/create/', {
      username,
      password
    });

    const { access, refresh } = res.data;
    localStorage.setItem('access', access);
    localStorage.setItem('refresh', refresh);

    // ✅ Set default Authorization header globally
    axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;

    const userInfo = await axios.get('http://localhost:8000/auth/users/me/');
    const role = userInfo.data.role;

    if (role === 'Admin') navigate('/admin');
    else if (role === 'Student') navigate('/student');
    else alert("Unknown role. Access denied.");

  } catch (err) {
    console.error("Login error:", err);
    alert("Login failed. Please check your credentials.");
  }
};

  return (
    <div className="home-container">
      <div className="login-card">
        <h1>WELCOME TO GRADVIEW</h1>
        <p>Manage and analyze student records</p>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}
