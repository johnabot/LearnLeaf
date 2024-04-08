// @flow
import React, { useState, useEffect } from 'react';
import { useUser } from '/src/UserState.jsx';
import { fetchSubjects } from '/src/LearnLeaf_Functions.jsx';
import { AddSubjectForm } from './AddSubjectForm.jsx';
import SubjectWidget from './SubjectWidget.jsx';
import './SubjectDashboard.css';
import '/src/Components/PageFormat.css'

const SubjectsDashboard = () => {
    const [isOpen, setIsOpen] = useState(false); // Renamed to isOpen for clarity
    const [subjects, setSubjects] = useState([]);
    const { user } = useUser();

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

    return (
        <div className="subjects-dashboard">
            <div className="top-bar">
                <img src="/src/LearnLeaf_Name_Logo_Wide.svg" alt="LearnLeaf_name_logo" className="logo" />
                <nav className="nav-links">
                    <a href="/tasks">All Tasks</a>
                    <a href="/calendar">Calendar</a>
                    <a href="/projects">Projects</a>
                    <a href="/archives">Archives</a>
                    <a href="/profile">User Profile</a>
                </nav>
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
