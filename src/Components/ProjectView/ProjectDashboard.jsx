import React, { useEffect, useState } from 'react';
import { useUser } from '/src/UserState.jsx';
import { fetchProjects } from '/src/LearnLeaf_Functions.jsx';
import { AddProjectForm } from './AddProjectForm.jsx';
import ProjectWidget from './ProjectWidget.jsx';
import './ProjectDashboard.css';
import '/src/Components/PageFormat.css';

const ProjectsDashboard = () => {
    const [projects, setProjects] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useUser();

    useEffect(() => {
        if (user?.id) {
            fetchProjects(user.id)
                .then(fetchedProjects => setProjects(fetchedProjects))
                .catch(error => console.error("Error fetching projects:", error));
        }
    }, [user?.id]);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    const refreshProjects = async () => {
        const updatedProjects = await fetchProjects(user.id);
        setProjects(updatedProjects);
    };

    return (
        <div className="projects-dashboard">
            <div className="top-bar">
                <img src="/src/LearnLeaf_Name_Logo_Wide.svg" alt="LearnLeaf_name_logo" className="logo" />
                <nav className="nav-links">
                    <a href="/tasks">All Tasks</a>
                    <a href="/calendar">Calendar</a>
                    <a href="/subjects">Subjects</a>
                    <a href="/archives">Archives</a>
                    <a href="/profile">User Profile</a>
                </nav>
            </div>
            <div className="projects-grid">
                {projects.map(project => (
                    <ProjectWidget key={project.id} project={project} refreshProjects={refreshProjects} />
                ))}
            </div>
            <button className="fab" onClick={handleOpen}>
                +
            </button>
            {isOpen && (
                <AddProjectForm
                    isOpen={isOpen}
                    onClose={handleClose}
                    refreshProjects={refreshProjects}
                />
            )}
        </div>
    );
};

export default ProjectsDashboard;
