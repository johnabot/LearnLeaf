import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import TasksTable from './TaskTable';
import { useUser } from '/src/UserState.jsx';
import { fetchTasks } from '/src/LearnLeaf_Functions.jsx'
import { AddTaskForm } from './AddTaskForm.jsx';
import '/src/Components/FormUI.css';

const TaskList = () => {
    const [showForm, setShowForm] = useState(false);
    const [tasks, setTasks] = useState([]);
    const { user } = useUser();

    useEffect(() => {
        // Fetch tasks when the component mounts or the user id changes
        if (user?.id) {
            fetchTasks(user.id)
                .then(fetchedTasks => setTasks(fetchedTasks))
                .catch(error => console.error("Error fetching tasks:", error));
        }
    }, [user?.id]); // Re-fetch tasks when the user id changes

    const toggleFormVisibility = () => {
        console.log("Current showForm state:", showForm);
        setShowForm(!showForm);
        console.log("Toggled showForm state:", !showForm);
    };


    const refreshTasks = async () => {
        // Implement the logic to fetch tasks from the database and update state
        const updatedTasks = await fetchTasks(user.id);
        setTasks(updatedTasks);
    };

    const handleSubmit = (event) => {
      event.preventDefault();
      const { subject, assignment, priority, status, startDate, dueDate, timeDue, project } = event.target.elements;
  
      const newTask = {
          subject: subject.value,
          assignment: assignment.value, // Corrected from 'name' to 'assignment' for consistency
          priority: priority.value,
          status: status.value,
          startDate: startDate.value,
          dueDate: dueDate.value,
          timeDue: timeDue.value,
          project: project.value
      };
  
      setTasks([...tasks, newTask]);
      setShowForm(false);
  };

    return (
        <div className="task-view-container">
            <div className="top-bar">
                <img src="/src/LearnLeaf_Logo_Circle.svg" alt="Logo" className="logo" />
                <div className="name-links">
                    <div className="app-name"><h1>LearnLeaf Organizer</h1></div>
                    <nav className="nav-links">
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
            {showForm && <AddTaskForm closeForm={() => setShowForm(false)} refreshTasks={refreshTasks} />}

            <div>
                <h1 style={{ color: '#907474' }}>{user.name}'s Upcoming Tasks</h1>
                <TasksTable tasks={tasks} refreshTasks={refreshTasks} />
            </div>
        </div>
    );
};
export default TaskList;

