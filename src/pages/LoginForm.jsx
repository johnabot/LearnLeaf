import logo from '/src/LearnLeaf_Name_Logo_Wide.png';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '/src/LearnLeaf_Functions.jsx';
import { useUser } from '/src/UserState.jsx';
import { Link } from 'react-router-dom';
import '/src/Components/Login_Register_Reset.css';


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
            updateUser({ id: userInfo.id, name: userInfo.name, email: userInfo.email, password: userInfo.password, notifications: userInfo.notifcations, notificationFrequency: userInfo.notificationFrequency }); // Update global user state
            navigate('/tasks'); // Navigate to tasks page upon successful login
        } catch (error) {
            alert(`Login Error: ${error.message}`);
        }

        // Reset form fields
        setEmail('');
        setPassword('');
    };

    return (
        <div className="login-form-container">
            <div className="top-bar">
                <img src={logo} alt="LearnLeaf_name_logo"/>
            </div>
            <h1 style={{ color: '#907474' }}>Streamlining success, one task at a time!</h1>
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
                <button type="submit">Login</button> {/* Changed button text to Login */}
                <i><p><Link to="/resetPassword">Reset Password</Link></p></i>
                <p>Don't have an account? <Link to="/register">Register</Link></p>
            </form>
        </div>
    );
}

export default LoginForm;
