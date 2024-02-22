import React, { useState } from 'react';
import { loginUser } from '/src/LearnLeaf_JSFrontend.js'; // Import loginUser instead of registerUser
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import '/workspaces/Team6_3311/src/Components/FormUI.css';


function LoginForm() {
  // State for email and password fields only, as name is not required for login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Function to handle form submission for login
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    loginUser(email, password); // Call loginUser instead of registerUser

    console.log('Logging in:', { email, password });
    // Optionally reset form fields after submission
    setEmail('');
    setPassword('');
  };

  return (
    <div className="login-form-container"> {/* Changed class name to reflect login form */}
      <h1>LearnLeaf Task Organizer</h1> {/* Changed heading to Login */}
      <h2>Helping you manage your everyday needs!</h2>
      <form onSubmit={handleSubmit}>
        {/* Removed name field as it's not required for login */}
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
        <i><p>Forgot password</p></i>
        <p>Don't have an account? <Link to="/register">Register</Link></p> {/* Add this line */}
      </form>
    </div>
  );
}

export default LoginForm;
