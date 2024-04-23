// @flow
import React, { useState, useEffect } from 'react';
import { useUser } from '/src/UserState.jsx';
import { useNavigate } from 'react-router-dom';
import { fetchSubjects, logoutUser } from '/src/LearnLeaf_Functions.jsx';
import { AddSubjectForm } from './AddSubjectForm.jsx';
import SubjectWidget from './SubjectWidget.jsx';
import './SubjectDashboard.css';
import '/src/Components/PageFormat.css'

const SubjectsDashboard = () => {
    const [isOpen, setIsOpen] = useState(false); // Renamed to isOpen for clarity
    const [subjects, setSubjects] = useState([]);
    const { user, updateUser } = useUser();
    const navigate = useNavigate();


    useEffect(() => {
        if (user?.id) {
            fetchSubjects(user.id)
                .then(fetchedSubjects => setSubjects(fetchedSubjects))
                .catch(error => console.error("Error fetching subjects:", error));
        }
    }, [user?.id]);

    const onClose = () => setIsOpen(false); // Function to close the modal
    const onOpen = () => setIsOpen(true); // Function to open the modal

    const refreshSubjects = async () => {
        console.log("Refreshing subjects...");
        const updatedSubjects = await fetchSubjects(user.id);
        console.log("Successfully refreshed subjects");
        setSubjects(updatedSubjects);
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

    return (
        <div className="view-container">
            <div className="top-bar">
                <img src="/src/LearnLeaf_Name_Logo_Wide.png" alt="LearnLeaf_name_logo" className="logo" />
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
            <div className="subjects-grid">
                {subjects.map(subject => (
                    <SubjectWidget key={subject.id} subject={subject} refreshSubjects={refreshSubjects} />
                ))}
            </div>
            <button className="fab" onClick={onOpen}>
                +
            </button>
            {isOpen && <AddSubjectForm isOpen={isOpen} onClose={onClose} refreshSubjects={refreshSubjects} />}
        </div>
    );
};

export default SubjectsDashboard;
