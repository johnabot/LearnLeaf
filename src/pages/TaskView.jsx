import logo from '/src/LearnLeaf_Name_Logo_Wide.png';
import React, { useState, useEffect } from 'react';
import TasksTable from '/src/Components/TaskView/TaskTable.jsx';
import { useUser } from '/src/UserState.jsx';
import { useNavigate } from 'react-router-dom';
import { fetchTasks, logoutUser } from '/src/LearnLeaf_Functions.jsx'
import { AddTaskForm } from '/src/Components/TaskView/AddTaskForm.jsx';
import '/src/Components/FormUI.css';
import '/src/Components/TaskView/TaskView.css';


const TaskList = () => {
    const [isAddTaskFormOpen, setIsAddTaskFormOpen] = useState(false);
    const [tasks, setTasks] = useState([]);
    const { user, updateUser } = useUser();
    const navigate = useNavigate();


    useEffect(() => {
        // Fetch tasks when the component mounts or the user id changes
        if (user?.id) {
            fetchTasks(user.id)
                .then(fetchedTasks => setTasks(fetchedTasks))
                .catch(error => console.error("Error fetching tasks:", error));
        }
    }, [user?.id]); // Re-fetch tasks when the user id changes

    const toggleFormVisibility = () => {
        setIsAddTaskFormOpen(!isAddTaskFormOpen);
    };

    const refreshTasks = async () => {
        // Fetch tasks from the database and update state
        const updatedTasks = await fetchTasks(user.id);
        setTasks(updatedTasks);
    };

    // Handler to close the AddTaskForm
    const handleCloseAddTaskForm = () => {
        setIsAddTaskFormOpen(false);
        refreshTasks(); // Optionally refresh tasks upon closing the form to reflect any changes
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
            <button className="fab" onClick={toggleFormVisibility}>
                +
            </button>
            {isAddTaskFormOpen && (
                <AddTaskForm
                    isOpen={isAddTaskFormOpen}
                    onClose={handleCloseAddTaskForm}
                    refreshTasks={refreshTasks}
                />
            )}
            <div className="task-list">
                <h1 style={{ color: '#907474' }}>{user.name}'s Upcoming Tasks</h1>
                <TasksTable tasks={tasks} refreshTasks={refreshTasks} />
            </div>
        </div>
    );
};
export default TaskList;
