import React, { useState } from 'react';
import { MdClose } from 'react-icons/md';
import axios from 'axios';

const SignupForm = ({ handleSignup, handleClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('/api/auth/signup', { name, email, password });
      handleSignup(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="addContainer">
      <form onSubmit={handleSubmit}>
        <div className="close-btn" onClick={handleClose}><MdClose /></div>
        {error && <p className="error">{error}</p>}
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button className="btn" type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignupForm;
