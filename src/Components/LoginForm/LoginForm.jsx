import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '/src/LearnLeaf_Functions.jsx';
import { useUser } from '../../UserState';
import { Link } from 'react-router-dom';
import '/src/Components/FormUI.css';

function LoginForm() {
    const [email, setEmail] = useState(''); // State for the email input
    const [password, setPassword] = useState(''); // State for the password input
    const { updateUser } = useUser(); // Use the updateUser function from the context
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent the default form submission

        try {
            // Use the email and password from the component's state
            const userInfo = await loginUser(email, password);
            updateUser({ id: userInfo.id, name: userInfo.name, email: userInfo.email }); // Update global user state
            navigate('/tasks'); // Navigate to tasks page upon successful login
        } catch (error) {
            alert(`Login Error: ${error.message}`);
        }

        // Reset form fields
        setEmail('');
        setPassword('');
    };

  return (
    <div className="login-form-container"> {/* Changed class name to reflect login form */}
      <h1>LearnLeaf Organizer</h1> {/* Changed heading to Login */}
      <h2>Helping you manage your everyday needs!</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button> {/* Changed button text to Login */}
        <i><p><Link to="/resetPassword">Reset Password</Link></p></i>
        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </form>
    </div>
  );
}

export default LoginForm;
