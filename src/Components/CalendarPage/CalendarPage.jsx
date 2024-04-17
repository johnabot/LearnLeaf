import React, { useState, useEffect } from 'react';
import CalendarUI from './CalendarUI';
import { fetchTasks, logoutUser } from '/src/LearnLeaf_Functions.jsx'
import { useUser } from '/src/UserState.jsx';
import { useNavigate } from 'react-router-dom';
import 'react-big-calendar/lib/css/react-big-calendar.css';


const CalendarView = () => {

    const handleLogout = async () => {
        try {
            await logoutUser();
            updateUser(null);
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className="view-container">
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
            <CalendarUI />
        </div>
    );
}

export default CalendarView;