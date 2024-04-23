import logo from '/src/LearnLeaf_Name_Logo_Wide.png';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '/src/UserState.jsx';
import { fetchTasks } from '/src/LearnLeaf_Functions.jsx';
import TasksTable from '/src/Components/TaskView/TaskTable.jsx';
import { AddTaskForm } from '/src/Components/TaskView/AddTaskForm.jsx';
import '/src/Components/FormUI.css';


const SubjectTasks = () => {
    const { subjectName } = useParams(); // Get subjectName from URL
    const { user } = useUser();
    const [tasks, setTasks] = useState([]);
    const [isAddTaskFormOpen, setIsAddTaskFormOpen] = useState(false);

    useEffect(() => {
        // Fetch tasks when the component mounts or the user id changes
        if (user?.id) {
            fetchTasks(user.id, subjectName)
                .then(fetchedTasks => setTasks(fetchedTasks))
                .catch(error => console.error("Error fetching tasks:", error));
        }
    }, [user?.id]); // Re-fetch tasks when the user id changes

    const toggleFormVisibility = () => {
        setIsAddTaskFormOpen(!isAddTaskFormOpen);
    };

    const refreshTasks = async () => {
        // Fetch tasks from the database and update state
        const updatedTasks = await fetchTasks(user.id, subjectName);
        setTasks(updatedTasks);
    };

    // Handler to close the AddTaskForm
    const handleCloseAddTaskForm = () => {
        setIsAddTaskFormOpen(false);
        refreshTasks(); // Optionally refresh tasks upon closing the form to reflect any changes
    };

    return (
        <div className="view-container">
            <div className="top-bar">
                <img src={logo} alt="LearnLeaf_name_logo"/>
                <div className="name-links">
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
            {isAddTaskFormOpen && (
                <AddTaskForm
                    initialSubject={subjectName}
                    isOpen={isAddTaskFormOpen}
                    onClose={handleCloseAddTaskForm}
                    refreshTasks={refreshTasks}
                />
            )}
            <div>
                <h1 style={{ color: '#907474' }}>Upcoming Tasks for {subjectName}</h1>
                <TasksTable tasks={tasks} refreshTasks={refreshTasks} />
            </div>
        </div>
    );
};

export default SubjectTasks;
