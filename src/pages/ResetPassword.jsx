import logo from '/src/LearnLeaf_Name_Logo_Wide.png';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetPassword } from '/src/LearnLeaf_Functions.jsx';

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
        <div className="login-form-container">
            <div className="top-bar">
                <img src={logo} alt="LearnLeaf_name_logo"/>
            </div>
            <h2 style={{ color: '#907474' }}>Reset Password</h2>
            <form className="form-group" onSubmit={handleSubmit}>
                <div className="form-inputs">
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Email"
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