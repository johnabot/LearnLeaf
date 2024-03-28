// @flow
import React, { useState, useEffect } from 'react';
import { useUser } from '/src/UserState.jsx';
import { fetchSubjects } from '/src/LearnLeaf_Functions.jsx';
import { AddSubjectForm } from './AddSubjectForm.jsx';
import SubjectWidget from './SubjectWidget.jsx';
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
        console.log("Refreshing subjects...");
        const updatedSubjects = await fetchSubjects(user.id);
        console.log("Sucessfully refreshed subjects");

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
                    <SubjectWidget key={subject.id} subject={subject} />
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
