import React, { useState, useEffect } from 'react';
import { useUser } from '/src/UserState.jsx';
import { useNavigate } from 'react-router-dom';
import { logoutUser, updateUserDetails, deleteUser } from '/src/LearnLeaf_Functions.jsx';
import '/src/Components/FormUI.css';
import './UserProfile.css';

const UserProfile = () => {
    const { user, updateUser } = useUser();
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState(user.name || '');
    const [email, setEmail] = useState(user.email || '');
    const [password, setPassword] = useState(user.password || '');
    const [notificationsEnabled, setNotificationsEnabled] = useState(user.notifications || false);
    const [notificationFrequencies, setNotificationFrequencies] = useState(user.notificationsFrequency || [true, false, false, false]);
    const navigate = useNavigate();

    useEffect(() => {
        setName(user.name || '');
        setEmail(user.email || '');
        setPassword(user.password || '');
        setNotificationsEnabled(user.notifications || false);
        setNotificationFrequencies(user.notificationsFrequency || [true, false, false, false]);
    }, [user]);

    const handleNotificationChange = (event) => {
        const enabled = event.target.checked;
        setNotificationsEnabled(enabled);
        if (!enabled) {
            setNotificationFrequencies([true, false, false, false]);
        } else {
            setNotificationFrequencies([false, ...notificationFrequencies.slice(1)]);
        }
    };

    const handleFrequencyChange = (index) => {
        const newFrequencies = notificationFrequencies.map((freq, idx) =>
            idx === index ? !freq : freq
        );
        setNotificationFrequencies(newFrequencies);
    };

    const handleUpdateProfile = async () => {
        const userDetails = {
            name,
            email,
            password,
            notifications: notificationsEnabled,
            notificationsFrequency: notificationFrequencies
        };
        try {
            await updateUserDetails(user.id, userDetails);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Failed to update profile:', error);
            alert('Failed to update profile.');
        }
    };

    const handleLogout = async () => {
        try {
            await logoutUser();
            updateUser(null);
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleDeleteClick = async () => {
        const confirmation = window.confirm("Are you sure you want to delete your account? This action is not reversible.");
        if (confirmation) {
            try {
                await deleteUser(user.id);
                console.log("User account and all related data deleted successfully");
                updateUser(null);
                navigate('/');
            } catch (error) {
                console.error('Account Deletion failed:', error);
            }
        }
    };

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
                        <input type="text" id="name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input type="text" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div>
                            <label htmlFor="showPassword">Show Password:</label>
                            <input type="checkbox" id="showPassword" onClick={() => setShowPassword(!showPassword)} />
                        </div>
                    </div>
                    <button className="update" onClick={handleUpdateProfile}>Update Details</button>
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
                        <input type="checkbox" id="notifications" checked={notificationsEnabled} onChange={handleNotificationChange} />
                    </div>
                    {notificationsEnabled && (
                        <div className="notification-preferences">
                            <div className="preference-selection">
                                <label htmlFor="weekly" title="Receive updates once a week.">Weekly:</label>
                                <input type="checkbox" id="weekly" name="weekly" checked={notificationFrequencies[1]} onChange={() => handleFrequencyChange(1)} />
                            </div>
                            <div className="preference-selection">
                                <label htmlFor="daily" title="Receive updates once a day.">Daily:</label>
                                <input type="checkbox" id="daily" name="daily" checked={notificationFrequencies[2]} onChange={() => handleFrequencyChange(2)} />
                            </div>
                            <div className="preference-selection">
                                <label htmlFor="urgent" title="Receive updates of tasks due today.">Urgent:</label>
                                <input type="checkbox" id="urgent" name="urgent" checked={notificationFrequencies[3]} onChange={() => handleFrequencyChange(3)} />
                            </div>
                        </div>
                    )}
                    <button className="update" onClick={handleUpdateProfile}>Update Preferences</button>
                </div>

                <button className="deleteAcc-button" onClick={handleDeleteClick}>Delete Account</button>
            </div>
        </div>
    );
}

export default UserProfile;
