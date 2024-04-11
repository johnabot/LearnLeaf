// NOTE: This is not an active file YET - it will be used once user preferences are implemented

import React, { useState, useEffect } from 'react';
import { getUserInfo, updateUserInfo, getUserPreferences, updateUserPreferences } from './UserServices'; // Placeholder for your actual import paths
import { logoutUser } from '/src/LearnLeaf_Functions.jsx';
import { useUser } from '/src/UserState.jsx';

export function UserProfilePage() {
    const [userInfo, setUserInfo] = useState({ name: '', email: '' });
    const [userPreferences, setUserPreferences] = useState({
        timeFormat: '12h',
        dateFormat: 'MM/DD/YYYY',
        theme: 'light',
        notifications: false,
    });

    useEffect(() => {
        // Fetch user info and preferences
        const fetchUserInfo = async () => {
            const info = await getUserInfo();
            setUserInfo(info);
        };

        const fetchUserPreferences = async () => {
            const preferences = await getUserPreferences();
            setUserPreferences(preferences);
        };

        fetchUserInfo();
        fetchUserPreferences();
    }, []);

    const handleUserInfoChange = (e) => {
        const { name, value } = e.target;
        setUserInfo(prevState => ({ ...prevState, [name]: value }));
    };

    const handleUserPreferencesChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUserPreferences(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const saveUserInfo = async () => {
        await updateUserInfo(userInfo);
        alert('User info updated successfully!');
    };

    const saveUserPreferences = async () => {
        await updateUserPreferences(userPreferences);
        alert('User preferences updated successfully!');
    };

    const handleLogout = () => {
        logoutUser();
        // Redirect to login page or perform other cleanup
    };

    return (
        <div className="view-container">
            <h2>User Profile</h2>
            <div>
                <h3>Account Information</h3>
                <input type="text" name="name" value={userInfo.name} onChange={handleUserInfoChange} placeholder="Name" />
                <input type="email" name="email" value={userInfo.email} onChange={handleUserInfoChange} placeholder="Email" />
                <button onClick={saveUserInfo}>Save</button>
            </div>

            <div>
                <h3>Preferences</h3>
                <select name="timeFormat" value={userPreferences.timeFormat} onChange={handleUserPreferencesChange}>
                    <option value="12h">12 hours</option>
                    <option value="24h">24 hours</option>
                </select>
                <select name="dateFormat" value={userPreferences.dateFormat} onChange={handleUserPreferencesChange}>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                </select>
                <select name="theme" value={userPreferences.theme} onChange={handleUserPreferencesChange}>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                </select>
                <label>
                    <input type="checkbox" name="notifications" checked={userPreferences.notifications} onChange={handleUserPreferencesChange} />
                    Enable Notifications
                </label>
                <button onClick={saveUserPreferences}>Save</button>
            </div>

            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}
