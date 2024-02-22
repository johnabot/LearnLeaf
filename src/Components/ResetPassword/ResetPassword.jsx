import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { resetPassword } from '/src/LearnLeaf_JSFrontend.js';

function ResetPassword() {
  // State for each input field
  const [email, setEmail] = useState('');
  const navigate = useNavigate(); // Create the navigation function

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    resetPassword(email)
      .then(() => {
        // Navigate to the login page after successful reset
        navigate('/');
      })
      .catch((error) => {
        // Handle the error, possibly by showing a message to the user
        console.error('Error resetting password:', error);
      });

    // Clear the input field
    setEmail('');
  };

  return (
    <div className="resetPassword-form-container">
      <h2>Reset Password</h2>
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
        <button type="submit">Reset</button>
      </form>
    </div>
  );
}

export default ResetPassword;