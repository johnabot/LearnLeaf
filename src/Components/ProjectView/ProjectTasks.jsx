import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '/src/UserState.jsx';
import { fetchTasks } from '/src/LearnLeaf_Functions.jsx';
import TasksTable from '/src/Components/TaskView/TaskTable.jsx';
import { AddTaskForm } from '/src/Components/TaskView/AddTaskForm.jsx';
import '/src/Components/PageFormat.css'
import '/src/Components/FormUI.css';


const ProjectTasks = () => {
    const { projectName } = useParams(); // Get ProjectName from URL
    const { user } = useUser();
    const [tasks, setTasks] = useState([]);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        if (user?.id && projectName) {
            fetchTasks(user.id, projectName)
                .then(fetchedTasks => {
                    setTasks(fetchedTasks);
                })
                .catch(error => console.error("Error fetching tasks for project:", error));
        }
    }, [user?.id, projectName]); // Add selectedProjects to dependency array


    const toggleFormVisibility = () => {
        console.log("Current showForm state:", showForm);
        setShowForm(!showForm);
        console.log("Toggled showForm state:", !showForm);
    };

    const refreshTasks = async () => {
        // Refetch tasks when a new task is added
        const updatedTasks = await fetchTasks(user.id, projectName);
        setTasks(updatedTasks);
    };

    return (
        <div className="task-view-container">
            <div className="top-bar">
                <img src="/src/LearnLeaf_Logo_Circle.svg" alt="Logo" className="logo" />
                <div className="name-links">
                    <div className="app-name"><h1>LearnLeaf Organizer</h1></div>
                    <nav className="nav-links">
                        <a href="/tasks">All Tasks</a>
                        <a href="/calendar">Calendar</a>
                        <a href="/subjects">Subjects</a>
                        <a href="/projects">Projects</a>
                        <a href="/archives">Archives</a>
                        <a href="/profile">User Profile</a>
                    </nav>
                </div>
            </div>
            <button className="fab" onClick={toggleFormVisibility}>
                +
            </button>
            {showForm && <AddTaskForm initialProject={projectName} closeForm={() => setShowForm(false)} refreshTasks={refreshTasks} />}

            <div>
                <h1 style={{ color: '#907474' }}>Upcoming Tasks for {projectName}</h1>
                <TasksTable tasks={tasks} refreshTasks={refreshTasks} />
            </div>
        </div>
    );
};

export default ProjectTasks;
