import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '/src/LearnLeaf_Functions.jsx';
function RegistrationForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleSubmit = event => {
    event.preventDefault();
    registerUser(email, password, name).then(function () {
      navigate('/');
    }).catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      alert("Error code: " + errorCode + "\n" + errorMessage);
      throw error;
    });
    setName('');
    setEmail('');
    setPassword('');
  };
  return <div className="registration-form-container">
      <h2>Register Here!</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>;
}
export default RegistrationForm;