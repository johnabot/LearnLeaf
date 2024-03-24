import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '/src/UserState.jsx';
import { fetchSubjects } from '/src/LearnLeaf_Functions.jsx';
import { AddSubjectForm } from './AddSubjectForm.jsx';
import './SubjectDashboard.css';
import '/src/Components/PageFormat.css'

const SubjectsDashboard = () => {
    const [showForm, setShowForm] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const { user } = useUser();

    useEffect(() => {
        if (user?.id) {
            fetchSubjects(user.id)
                .then(fetchedSubjects => setSubjects(fetchedSubjects))
                .catch(error => console.error("Error fetching subjects:", error));
        }
    }, [user?.id]);

    const toggleFormVisibility = () => {
        console.log("Current showForm state:", showForm);
        setShowForm(!showForm);
        console.log("Toggled showForm state:", !showForm);
    };

    const refreshSubjects = async () => {
        // Implement the logic to fetch tasks from the database and update state
        const updatedSubjects = await fetchSubjects(user.id);
        setSubjects(updatedSubjects);
    };

    return (
        <div className="subjects-dashboard">
            <div className="top-bar">
                <img src="/src/LearnLeaf_Logo_Circle.svg" alt="Logo" className="logo" />
                <div className="name-links">
                    <div className="app-name"><h1>LearnLeaf Organizer</h1></div>
                    <nav className="nav-links">
                        <a href="/tasks">All Tasks</a>
                        <a href="/calendar">Calendar</a>
                        <a href="/projects">Projects</a>
                        <a href="/archives">Archives</a>
                        <a href="/profile">User Profile</a>
                    </nav>
                </div>
            </div>
            <div className="subjects-grid">
                {subjects.map(({ subjectName, semester, status }) => (
                    <div key={subjectName} className="subject-widget">
                        <a
                            href={`/subjects/${subjectName}`}
                            className="subject-name-link"
                            onMouseEnter={() => {/* Tooltip logic here */ }}
                            onMouseLeave={() => {/* Tooltip logic here */ }}
                        >
                            {subjectName}
                        </a>
                        <div className="semester">{semester}</div>
                        {status === "Active" && (
                            <button className="archive-button" onClick={() => {/* Archive logic here */ }}>
                                Archive
                            </button>
                        )}
                    </div>
                ))}
            </div>
            <button className="fab" onClick={toggleFormVisibility}>
                +
            </button>
            {showForm && <AddSubjectForm closeForm={() => setShowForm(false)} refreshSubjects={refreshSubjects} />}
        </div >
    );
};

export default SubjectsDashboard;
