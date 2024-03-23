import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Correct imports based on your file structure
import { getFirestore, doc, setDoc, getDocs, collection, addDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import TasksTable from './TaskTable';
import { useUser } from '/src/UserState.jsx'; // Adjust the path based on your file structure
import { fetchTasks, addTask } from '/src/LearnLeaf_Functions.js'
import { PopupForm } from './AddTaskForm.jsx';

function FloatingActionButton({ onClick }) {
    return (
        <button className="fab" onClick={onClick}>+</button>
    );
}

const TaskList = () => {
    const [showForm, setShowForm] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [updateTrigger, setUpdateTrigger] = useState(false); // Add a state to trigger updates
    const { user } = useUser();

    useEffect(() => {
        if (user?.id) {
            fetchTasks(user.id)
                .then(fetchedTasks => setTasks(fetchedTasks))
                .catch(error => console.error("Error fetching tasks:", error));
        }
    }, [user?.id, updateTrigger]); // Depend on updateTrigger to refetch tasks


    const handleSubmit = async (event) => {
        event.preventDefault();

        // Destructure the form's input values directly if possible or retrieve them from the state
        const { subject, assignment, priority, status, startDate, dueDate, dueTime, project } = event.target.elements;

        const taskDetails = {
            userId: user.id, // Assuming 'user' contains the logged-in user's ID
            subject: subject.value,
            assignment: assignment.value,
            priority: priority.value,
            status: status.value,
            startDate: startDate.value,
            dueDate: dueDate.value,
            dueTime: dueTime.value,
            project: project.value,
        };

        try {
            await addTask(taskDetails); // Pass the task details
            setUpdateTrigger(!updateTrigger); // Toggle the trigger to refetch tasks
            setShowForm(false); // Close the form
        } catch (error) {
            console.error("Error adding task:", error);
            // Handle errors or provide user feedback here
        }
    };


    return (
        <div className="task-view-container">
            <div className="top-bar">
                <img src="/src/LearnLeaf_Logo_Circle.svg" alt="Logo" className="logo" />
                <div className="app-name"><h1>LearnLeaf Organizer</h1></div>
                <nav className="nav-links">
                    <a href="/calendar">Calendar</a>
                    <a href="/projects">Projects</a>
                    <a href="/subjects">Subjects</a>
                    <a href="/archives">Archives</a>
                    <a href="/profile">User Profile</a>
                </nav>
            </div>
            <FloatingActionButton onClick={() => setShowForm(true)} />
            {showForm && <PopupForm closeForm={() => setShowForm(false)} />}

            {showForm && (
                <div className="task-form-container">
                    <form onSubmit={handleSubmit} className="task-form">
                        <input type="text" name="subject" placeholder="Subject" />
                        <input type="text" name="assignment" placeholder="Assignment" required />
                        <select name="priority">
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                        <select name="status">
                            <option value="Not Started">Not Started</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                        <input type="date" name="startDate" />
                        <input type="date" name="dueDate" />
                        <input type="time" name="dueTime" />
                        <input type="text" name="project" placeholder="Project Name" />
                        <button type="submit">Add Task</button>
                        <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
                    </form>
                </div>
            )}

            <div>
                <h1 style={{ color: '#907474' }}>{user.name}'s Upcoming Tasks</h1>
                <TasksTable tasks={tasks} />
            </div>
        </div>
    );
};
export default TaskList;
