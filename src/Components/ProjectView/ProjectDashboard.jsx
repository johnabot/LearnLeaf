import React, { useEffect, useState } from 'react';
import { useUser } from '/src/UserState.jsx';
import { fetchProjects } from '/src/LearnLeaf_Functions.jsx';
import { AddProjectForm } from './AddProjectForm.jsx';
import ProjectWidget from './ProjectWidget.jsx';
import './ProjectDashboard.css';
import '/src/Components/PageFormat.css'

const ProjectsDashboard = () => {
    const [projects, setProjects] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const { user } = useUser();

    useEffect(() => {
        if (user?.id) {
            fetchProjects(user.id)
                .then(fetchedProjects => setProjects(fetchedProjects))
                .catch(error => console.error("Error fetching projects:", error));
        }
    }, [user?.id]);

    const toggleFormVisibility = () => {
        console.log("Current showForm state:", showForm);
        setShowForm(!showForm);
        console.log("Toggled showForm state:", !showForm);
    };

    const refreshProjects = async () => {
        // Implement the logic to fetch tasks from the database and update state
        const updatedProjects = await fetchProjects(user.id);
        setProjects(updatedProjects);
    };

    return (
        <div className="projects-dashboard">
            <div className="top-bar">
                <img src="/src/LearnLeaf_Logo_Circle.svg" alt="Logo" className="logo" />
                <div className="name-links">
                    <div className="app-name"><h1>LearnLeaf Organizer</h1></div>
                    <nav className="nav-links">
                        <a href="/tasks">All Tasks</a>
                        <a href="/calendar">Calendar</a>
                        <a href="/subjects">Subjects</a>
                        <a href="/archives">Archives</a>
                        <a href="/profile">User Profile</a>
                    </nav>
                </div>
            </div>
            <div className="projects-grid">
                {projects.map(project => (
                    <ProjectWidget key={project.id} project={project} />
                ))}
            </div>
        <button className="fab" onClick={toggleFormVisibility}>
                +
            </button>
            {showForm && (
                <AddProjectForm
                    closeForm={() => setShowForm(false)}
                    refreshProjects={refreshProjects}
                />
            )}
        </div>

    );
};

export default ProjectsDashboard;
