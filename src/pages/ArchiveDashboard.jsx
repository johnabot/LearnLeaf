import logo from '/src/LearnLeaf_Name_Logo_Wide.png';
import React, { useState, useEffect } from 'react';
import { useUser } from '/src/UserState.jsx';
import { logoutUser, fetchArchivedTasks, fetchArchivedSubjects, reactivateSubject, fetchArchivedProjects, reactivateProject } from '/src/LearnLeaf_Functions.jsx';
import { useNavigate } from 'react-router-dom';
import TasksTable from '/src/Components/ArchivePage/ArchivedTaskTable.jsx';
import ArchivedSubjectWidget from '/src/Components/ArchivePage/ArchivedSubjectWidget.jsx';
import ArchivedProjectWidget from '/src/Components/ArchivePage/ArchivedProjectWidget.jsx';
import '/src/Components/ArchivePage/ArchiveDashboard.css';

const ArchivedItemsPage = () => {
    const { user, updateUser } = useUser();
    const navigate = useNavigate();
    const [archivedTasks, setArchivedTasks] = useState([]);
    const [archivedSubjects, setArchivedSubjects] = useState([]);
    const [archivedProjects, setArchivedProjects] = useState([]);
    const [showTasks, setShowTasks] = useState(false);
    const [showSubjects, setShowSubjects] = useState(false);
    const [showProjects, setShowProjects] = useState(false);

    const toggleSection = (section) => {
        if (section === 'tasks-content') {
            setShowTasks(!showTasks);
        } else if (section === 'subjects-content') {
            setShowSubjects(!showSubjects);
        } else if (section === 'projects-content') {
            setShowProjects(!showProjects);
        }
    };

    // Fetch archived tasks
    useEffect(() => {
        if (user?.id) {
            fetchArchivedTasks(user.id)
                .then(setArchivedTasks)
                .catch(error => console.error("Error fetching archived tasks:", error));
        }
    }, [user?.id]);

    // Refresh Tasks
    const refreshTasks = async () => {
        const updatedTasks = await fetchArchivedTasks(user.id);
        setArchivedTasks(updatedTasks);
    };

    // Fetch archived subjects
    useEffect(() => {
        if (user?.id) {
            fetchArchivedSubjects(user.id)
                .then(setArchivedSubjects)
                .catch(error => console.error("Error fetching archived subjects:", error));
        }
    }, [user?.id]);

    // Refresh Subjects
    const refreshSubjects = async () => {
        const updatedSubjects = await fetchArchivedSubjects(user.id);
        setArchivedSubjects(updatedSubjects);
    };

    // Fetch archived projects
    useEffect(() => {
        if (user?.id) {
            fetchArchivedProjects(user.id)
                .then(setArchivedProjects)
                .catch(error => console.error("Error fetching archived projects:", error));
        }
    }, [user?.id]);

    // Refresh Projects
    const refreshProjects = async () => {
        const updatedProjects = await fetchArchivedProjects(user.id);
        setArchivedProjects(updatedProjects);
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
        <>
            <div className="content-container">
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
                <h1 className="label">{user.name}'s Archives</h1>
                <div className="section"> 
                    <div className="section-header" onClick={() => toggleSection('tasks-content')}>Tasks</div>
                    <div id="tasks-content" className="section-content" style={{ display: showTasks ? 'block' : 'none' }}>
                        <TasksTable tasks={archivedTasks} refreshTasks={refreshTasks} />
                    </div>
                </div>
                <div className="section">
                    <h2 className="section-header" onClick={() => toggleSection('subjects-content')}>Subjects</h2>
                    <div id="subjects-grid" className="section-content" style={{ display: showSubjects ? 'grid' : 'none' }}>
                        {archivedSubjects.map(subject => (
                            <ArchivedSubjectWidget key={subject.id} subject={subject} reactivateSubject={reactivateSubject} refreshSubjects={refreshSubjects} />
                        ))}
                    </div>
                </div>
                <div className="section">
                    <h2 className="section-header" onClick={() => toggleSection('projects-content')}>Projects</h2>
                    <div id="projects-grid" className="section-content" style={{ display: showProjects ? 'grid' : 'none' }}>
                        {archivedProjects.map(project => (
                            <ArchivedProjectWidget key={project.projectId} project={project} reactivateProject={reactivateProject} refreshProjects={refreshProjects} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );

};

export default ArchivedItemsPage;
