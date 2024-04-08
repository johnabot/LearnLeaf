// NOTE: This file will later be removed - currently is just a barebones page to implement logging out

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '/src/LearnLeaf_Functions.jsx';
import '/src/Components/FormUI.css';

const UserProfile = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate('/'); // Navigate to log in page upon successful logout
    };

    return (
        <div className="user-profile">
            <div className="top-bar">
                <img src="/src/LearnLeaf_Name_Logo_Wide.svg" alt="LearnLeaf_name_logo" className="logo" />
                <nav className="nav-links">
                    <a href="/tasks">All Tasks</a>
                    <a href="/calendar">Calendar</a>
                    <a href="/subjects">Subjects</a>
                    <a href="/projects">Projects</a>
                    <a href="/archives">Archives</a>
                </nav>
            </div>
            <h2>User Profile</h2>
            <div>
                <h3>Account Information</h3>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" placeholder="Name" disabled />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" placeholder="Email" disabled />
                </div>
            </div>

            <div>
                <h3>Preferences</h3>
                <div>
                    <label htmlFor="timeFormat">Time Format:</label>
                    <select id="timeFormat" disabled>
                        <option value="12h">12 hours</option>
                        <option value="24h">24 hours</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="dateFormat">Date Format:</label>
                    <select id="dateFormat" disabled>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="theme">Theme:</label>
                    <select id="theme" disabled>
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="notifications">Enable Notifications:</label>
                    <input type="checkbox" id="notifications" disabled />
                </div>
            </div>

            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default UserProfile;
