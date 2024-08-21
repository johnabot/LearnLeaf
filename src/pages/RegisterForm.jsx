import logo from '/src/LearnLeaf_Name_Logo_Wide.png';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '/src/LearnLeaf_Functions.jsx';

function RegistrationForm() {
    // State for each input field
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Create the navigation function

    // Function to handle form submission
    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        registerUser(email, password, name)
            .then(function () {
                navigate('/'); // Navigate to the login page after successful reset
            })
            .catch(function (error) {
                // Error occurred. Inspect error.code.
                var errorCode = error.code;
                var errorMessage = error.message;
                // Error handling, like displaying a message to the user
                alert("Error code: " + errorCode + "\n" + errorMessage);
                throw error; // Throw the error so it can be caught where the function is called
            });
        // Reset form fields after submission for a better UX
        setName('');
        setEmail('');
        setPassword('');
    };

    return (
        <div className="login-form-container">
            <div className="top-bar">
                <img src={logo} alt="LearnLeaf_name_logo"/>
            </div>
            <h2 style={{ color: '#907474' }}>Register Here!</h2>
            <form className="form-group" onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
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
                <div className="form-group">
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default RegistrationForm;