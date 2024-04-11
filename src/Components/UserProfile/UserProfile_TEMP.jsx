// NOTE: This file will later be removed - currently is just a barebones page to implement logging out

import React from 'react';
import { useUser } from '/src/UserState.jsx';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '/src/LearnLeaf_Functions.jsx';
import '/src/Components/FormUI.css';
import './UserProfile.css';

const UserProfile = () => {
    const { user,updateUser } = useUser();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutUser();
            updateUser(null);
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // Need delete account function

    return (
        <div className="view-container">
            <div className="user-profile">
                <div className="top-bar">
                    <img src="/src/LearnLeaf_Name_Logo_Wide.svg" alt="LearnLeaf_name_logo" className="logo" />
                    <div className="top-navigation">
                        <nav className="nav-links">
                            <a href="/tasks">Tasks</a>
                            <a href="/calendar">Calendar</a>
                            <a href="/subjects">Subjects</a>
                            <a href="/projects">Projects</a>
                            <a href="/archives">Archives</a>
                            <a href="/profile">User Profile</a>
                        </nav>
                        <button className="logout-button" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            <div className="account-info">
                <h3>Account Information</h3>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" placeholder="Name" disabled />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" placeholder="Email" disabled />
                </div>
                <button className="update">Update</button>
            </div>

            <div className="preferences">
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
                <button className="update">Update</button>
            </div>

                <button className="deleteAcc-button">Delete Account</button>
                </div>
        </div>
    );
}

export default UserProfile;
