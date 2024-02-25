import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { displayTasks } from '/src/LearnLeaf_JSFrontend.js';
//import { createTask } from '/src/LearnLeaf_JSFrontend.js';
//import { editTask } from '/src/LearnLeaf_JSFrontend.js';
//import { deleteTask } from '/src/LearnLeaf_JSFrontend.js';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import TasksTable from './TaskTable';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        // Fetch tasks from your API or state management store
        // For demonstration, we'll use a static list
        const fetchedTasks = [
            {
                subject: 'CIS-330',
                assignment: 'Chapter 2 Review - Create Shell in C',
                priority: 'Low',
                status: 'In Progress',
                startDate: '01-Jan-2021',
                dueDate: '05-Jan-2021',
                timeDue: '11:59 PM'
            },
            {
                subject: 'CIS-330',
                assignment: 'Quiz 1',
                priority: 'High',
                status: 'Not Started',
                startDate: '02-Jan-2021',
                dueDate: '06-Jan-2021',
                timeDue: '5:30 PM'
            },
            {
                subject: 'IT-230',
                project: 'Group 5: Ethics',
                assignment: 'Part A',
                priority: 'Medium',
                status: 'Completed',
                startDate: '01-Feb-2021',
                dueDate: '05-Feb-2021',
                timeDue: '8:00 AM'
            },
            {
                subject: 'CIS-330',
                assignment: 'Chapter 2 Review',
                priority: 'Low',
                status: 'In Progress',
                startDate: '01-Jan-2021',
                dueDate: '05-Jan-2021',
                timeDue: '11:59 PM'
            },
            {
                subject: 'CIS-330',
                assignment: 'Quiz 1',
                priority: 'High',
                status: 'Not Started',
                startDate: '02-Jan-2021',
                dueDate: '06-Jan-2021',
                timeDue: '5:30 PM'
            },
            {
                subject: 'IT-230',
                project: 'Group 5: Ethics',
                assignment: 'Part A',
                priority: 'Medium',
                status: 'Completed',
                startDate: '01-Feb-2021',
                dueDate: '05-Feb-2021',
                timeDue: '8:00 AM'
            },
            {
                subject: 'CIS-330',
                assignment: 'Chapter 2 Review',
                priority: 'Low',
                status: 'In Progress',
                startDate: '01-Jan-2021',
                dueDate: '05-Jan-2021',
                timeDue: '11:59 PM'
            },
            {
                subject: 'CIS-330',
                assignment: 'Quiz 1',
                priority: 'High',
                status: 'Not Started',
                startDate: '02-Jan-2021',
                dueDate: '06-Jan-2021',
                timeDue: '5:30 PM'
            },
            {
                subject: 'IT-230',
                project: 'Group 5: Ethics',
                assignment: 'Part A',
                priority: 'Medium',
                status: 'Completed',
                startDate: '01-Feb-2021',
                dueDate: '05-Feb-2021',
                timeDue: '8:00 AM'
            },
            {
                subject: 'CIS-330',
                assignment: 'Chapter 2 Review',
                priority: 'Low',
                status: 'In Progress',
                startDate: '01-Jan-2021',
                dueDate: '05-Jan-2021',
                timeDue: '11:59 PM'
            },
            {
                subject: 'CIS-330',
                assignment: 'Quiz 1',
                priority: 'High',
                status: 'Not Started',
                startDate: '02-Jan-2021',
                dueDate: '06-Jan-2021',
                timeDue: '5:30 PM'
            },
            {
                subject: 'IT-230',
                project: 'Group 5: Ethics',
                assignment: 'Part A',
                priority: 'Medium',
                status: 'Completed',
                startDate: '01-Feb-2021',
                dueDate: '05-Feb-2021',
                timeDue: '8:00 AM'
            },
            {
                subject: 'CIS-330',
                assignment: 'Quiz 1',
                priority: 'High',
                status: 'Not Started',
                startDate: '02-Jan-2021',
                dueDate: '06-Jan-2021',
                timeDue: '5:30 PM'
            },
            {
                subject: 'IT-230',
                project: 'Group 5: Ethics',
                assignment: 'Part A',
                priority: 'Medium',
                status: 'Completed',
                startDate: '01-Feb-2021',
                dueDate: '05-Feb-2021',
                timeDue: '8:00 AM'
            },
            {
                subject: 'CIS-330',
                assignment: 'Quiz 1',
                priority: 'High',
                status: 'Not Started',
                startDate: '02-Jan-2021',
                dueDate: '06-Jan-2021',
                timeDue: '5:30 PM'
            },
            {
                subject: 'IT-230',
                project: 'Group 5: Ethics',
                assignment: 'Part A',
                priority: 'Medium',
                status: 'Completed',
                startDate: '01-Feb-2021',
                dueDate: '05-Feb-2021',
                timeDue: '8:00 AM'
            },
            {
                subject: 'CIS-330',
                assignment: 'Quiz 1',
                priority: 'High',
                status: 'Not Started',
                startDate: '02-Jan-2021',
                dueDate: '06-Jan-2021',
                timeDue: '5:30 PM'
            },
            {
                subject: 'IT-230',
                project: 'Group 5: Ethics',
                assignment: 'Part A',
                priority: 'Medium',
                status: 'Completed',
                startDate: '01-Feb-2021',
                dueDate: '05-Feb-2021',
                timeDue: '8:00 AM'
            },
            {
                subject: 'CIS-330',
                assignment: 'Quiz 1',
                priority: 'High',
                status: 'Not Started',
                startDate: '02-Jan-2021',
                dueDate: '06-Jan-2021',
                timeDue: '5:30 PM'
            },
            {
                subject: 'IT-230',
                project: 'Group 5: Ethics',
                assignment: 'Part A',
                priority: 'Medium',
                status: 'Completed',
                startDate: '01-Feb-2021',
                dueDate: '05-Feb-2021',
                timeDue: '8:00 AM'
            },
            {
                subject: 'CIS-330',
                assignment: 'Quiz 1',
                priority: 'High',
                status: 'Not Started',
                startDate: '02-Jan-2021',
                dueDate: '06-Jan-2021',
                timeDue: '5:30 PM'
            },
            {
                subject: 'IT-230',
                project: 'Group 5: Ethics',
                assignment: 'Part A',
                priority: 'Medium',
                status: 'Completed',
                startDate: '01-Feb-2021',
                dueDate: '05-Feb-2021',
                timeDue: '8:00 AM'
            }
        ];
        setTasks(fetchedTasks);
    }, []);

    return (
        <div className="task-view-container">
            <div className="top-bar">
                <img src="src\LearnLeaf_Logo_Circle.png" alt="Logo" className="logo" />
                <div className="app-name"><h1>LearnLeaf Organizer</h1></div>
                <nav className="nav-links">
                    <a href="/calendar">Calendar</a>
                    <a href="/projects">Projects</a>
                    <a href="/subjects">Subjects</a>
                    <a href="/archives">Archives</a>
                    <a href="/profile">User Profile</a>
                </nav>
            </div>

            <div>
                <h1 style={{color: '#907474'}}>Your Upcoming Tasks</h1>
                <TasksTable tasks={tasks} />
            </div>
        </div>
    );
};

export default TaskList;
