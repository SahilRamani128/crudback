import React, { useState } from 'react';
import { MdClose } from 'react-icons/md';
import axios from 'axios';

const LoginForm = ({ handleLogin, handleClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error before submitting
    try {
      const response = await axios.post('http://localhost:3000/api/login', { email, password });
      handleLogin(response.data);
    } catch (err) {
      console.error("Login error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred during login. Please try again.');
      }
    }
  };

  return (
    <div className="addContainer">
      <form onSubmit={handleSubmit}>
        <div className="close-btn" onClick={handleClose}><MdClose /></div>
        {error && <p className="error">{error}</p>}
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn" type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
