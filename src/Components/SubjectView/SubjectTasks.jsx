// @flow
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '/src/UserState.jsx';
import { fetchTasks } from '/src/LearnLeaf_Functions.jsx';
import TasksTable from '/src/Components/TaskView/TaskTable.jsx';
import { AddTaskForm } from '/src/Components/TaskView/AddTaskForm.jsx';
import '/src/Components/PageFormat.css'
import '/src/Components/FormUI.css';


const SubjectTasks = () => {
    const { subjectName } = useParams(); // Get subjectName from URL
    const { user } = useUser();
    const [tasks, setTasks] = useState([]);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        if (user?.id && subjectName) {
            fetchTasks(user.id, subjectName)
                .then(fetchedTasks => {
                    setTasks(fetchedTasks);
                })
                .catch(error => console.error("Error fetching tasks for subject:", error));
        }
    }, [user?.id, subjectName]); // Add selectedSubject to dependency array


    const toggleFormVisibility = () => {
        setShowForm(!showForm);
    };

    const refreshTasks = async () => {
        // Refetch tasks when a new task is added
        const updatedTasks = await fetchTasks(user.id, subjectName);
        setTasks(updatedTasks);
    };

    return (
        <div className="task-view-container">
            <div className="top-bar">
                <img src="/src/LearnLeaf_Name_Logo_Wide.svg" alt="LearnLeaf_name_logo" className="logo" />
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
            {showForm && <AddTaskForm initialSubject={subjectName} closeForm={() => setShowForm(false)} refreshTasks={refreshTasks} />}

            <div>
                <h1 style={{ color: '#907474' }}>Upcoming Tasks for {subjectName}</h1>
                <TasksTable tasks={tasks} refreshTasks={refreshTasks} />
            </div>
        </div>
    );
};

export default SubjectTasks;
