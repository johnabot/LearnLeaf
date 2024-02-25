import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { loginUser } from '/src/LearnLeaf_JSFrontend.js'; // Import loginUser function
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import '/src/Components/FormUI.css';


function LoginForm() {
  // State for email and password fields only, as name is not required for login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Create the navigation function

  // Function to handle form submission for login
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    loginUser(email, password)
      .then(() => {
          navigate('/tasks'); // Navigate to the Task View after successful login
        })
        .catch((error) => {
              // Error occurred. Inspect error.code.
              var errorCode = error.code;
              var errorMessage = error.message;
              // Error handling, like displaying a message to the user
              alert("Error code: " + errorCode + "\n" + errorMessage);
              throw error; // Throw the error so it can be caught where the function is called
        });
    
    setEmail('');
    setPassword('');
  };

  return (
    <div className="login-form-container"> {/* Changed class name to reflect login form */}
      <h1>LearnLeaf Organizer</h1> {/* Changed heading to Login */}
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
        <i><p><Link to="/resetPassword">Reset Password</Link></p></i>
        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </form>
    </div>
  );
}

export default LoginForm;
