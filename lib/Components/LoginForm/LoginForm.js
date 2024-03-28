import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '/src/LearnLeaf_Functions.jsx';
import { useUser } from '../../UserState';
import { Link } from 'react-router-dom';
import '/src/Components/FormUI.css';
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {
    updateUser
  } = useUser();
  const navigate = useNavigate();
  const handleSubmit = async event => {
    event.preventDefault();
    try {
      const userInfo = await loginUser(email, password);
      updateUser({
        id: userInfo.id,
        name: userInfo.name,
        email: userInfo.email
      });
      navigate('/tasks');
    } catch (error) {
      alert(`Login Error: ${error.message}`);
    }
    setEmail('');
    setPassword('');
  };
  return <div className="login-form-container"> {}
      <h1>LearnLeaf Organizer</h1> {}
      <h2>Helping you manage your everyday needs!</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Login</button> {}
        <i><p><Link to="/resetPassword">Reset Password</Link></p></i>
        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </form>
    </div>;
}
export default LoginForm;