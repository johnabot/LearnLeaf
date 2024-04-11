import React, { useState, useEffect } from 'react';
import { useUser } from '/src/UserState.jsx';
// import { TaskTable, SubjectWidget, ProjectWidget } from '/src/components'; // Assume these are your component imports
import './ArchiveDashboard.css'

const ArchivedItemsPage = () => {
    const { user } = useUser();

    // Example hooks to fetch archived items; replace with your actual data fetching logic
    const [archivedTasks, setArchivedTasks] = useState([]);
    const [archivedSubjects, setArchivedSubjects] = useState([]);
    const [archivedProjects, setArchivedProjects] = useState([]);

    useEffect(() => {
        // Fetch archived items here and set state
    }, []);

    function toggleSection(sectionId) {
        var content = document.getElementById(sectionId);
        if (content.style.display === "none" || content.style.display === '') {
            content.style.display = "block";
        } else {
            content.style.display = "none";
        }
    }


    return (
        <>
            <div className="view-container">
                <div class="top-bar">
                    <img src="/src/LearnLeaf_Name_Logo_Wide.svg" alt="LearnLeaf_name_logo" class="logo" />
                    <nav class="nav-links">
                        <a href="/tasks">Tasks</a>
                        <a href="/calendar">Calendar</a>
                        <a href="/subjects">Subjects</a>
                        <a href="/projects">Projects</a>
                        <a href="/profile">User Profile</a>
                    </nav>
                </div>


                <h1 class="label">{user.name}'s Archives</h1>

                <div class="section">
                    <h2 class="section-header" onclick="toggleSection('tasks-content')">Tasks</h2>
                    <div class="section-content" id="tasks-content">
                        {/* Placeholder for TaskTable component */}
                    </div>
                </div>

                <div class="section">
                    <h2 class="section-header" onclick="toggleSection('subjects-content')">Subjects</h2>
                    <div class="section-content" id="subjects-content">
                        {/* Example: <div><span>Subject Name</span><button class="activate-button">Activate</button></div> */}
                    </div>
                </div>

                <div class="section">
                    <h2 class="section-header" onclick="toggleSection('projects-content')">Projects</h2>
                    <div class="section-content" id="projects-content">
                        {/* Example: <div><span>Project Name</span><button class="activate-button">Activate</button></div> */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ArchivedItemsPage;
