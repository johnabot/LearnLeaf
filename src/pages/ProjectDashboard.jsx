import logo from '/src/LearnLeaf_Name_Logo_Wide.png';
import React, { useEffect, useState } from 'react';
import { useUser } from '/src/UserState.jsx';
import { useNavigate } from 'react-router-dom';
import { fetchProjects, logoutUser } from '/src/LearnLeaf_Functions.jsx';
import { AddProjectForm } from '/src/Components/ProjectView/AddProjectForm.jsx';
import ProjectWidget from '/src/Components/ProjectView/ProjectWidget.jsx';
import '/src/Components/ProjectView/ProjectDashboard.css';
import '/src/Components/PageFormat.css';

const ProjectsDashboard = () => {
    const [projects, setProjects] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const { user, updateUser } = useUser();
    const navigate = useNavigate();


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
                <img src={logo} alt="LearnLeaf_name_logo"/>
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
