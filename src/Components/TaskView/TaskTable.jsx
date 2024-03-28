// @flow
import React, { useState } from 'react';
import { editTask, deleteTask, fetchTasks } from '/src/LearnLeaf_Functions.jsx';
import { useUser } from '/src/UserState.jsx';
import './TaskView.css';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// This component expects an array of tasks as a prop
const CustomIconButton = styled(IconButton)({
    border: '1px solid rgba(0, 0, 0, 0.23)', // Match the default Material-UI outlined border
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)', // Optional: change the hover background color
    },
});

const TasksTable = ({ tasks, refreshTasks }) => {
    const [isEditing, setIsEditing] = useState(null);
    const [editedTask, setEditedTask] = useState({});
    const [filterCriteria, setFilterCriteria] = useState({
        priority: '',
        status: '',
        startDate: '',
        startDateComparison: '',
        dueDate: '',
        dueDateComparison: '',
    });

    // Helper function to determine color based on the due date
    const getDateColor = (dueDateStr) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Remove time components
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const dueDate = new Date(dueDateStr);
        dueDate.setHours(0, 0, 0, 0); // Match comparison

        if (dueDate < today) return 'red'; // Overdue
        if (dueDate.getTime() === today.getTime()) return 'orange'; // Due today
        if (dueDate.getTime() === tomorrow.getTime()) return '#01ba01'; // Due tomorrow
        return 'black'; // Default color
    };

    const filterByDate = (taskDateStr, filterDateStr, comparisonType) => {
        let taskDate = new Date(taskDateStr);
        taskDate = new Date(taskDate.getTime() - taskDate.getTimezoneOffset() * 60000).setHours(0, 0, 0, 0);

        let filterDate = new Date(filterDateStr);
        filterDate = new Date(filterDate.getTime() - filterDate.getTimezoneOffset() * 60000).setHours(0, 0, 0, 0);


        switch (comparisonType) {
            case 'before':
                return taskDate < filterDate;
            case 'before-equal':
                return taskDate <= filterDate;
            case 'equal':
                return taskDate.toDateString() === filterDate.toDateString();
            case 'after':
                return taskDate > filterDate;
            case 'after-equal':
                return taskDate >= filterDate;
            default:
                return true;
        }
    };

    const getFilteredTasks = (tasks, filterCriteria) => {
        return tasks.filter((task) => {
            // Check for priority and status filters
            const matchesPriority = !filterCriteria.priority || task.priority === filterCriteria.priority;
            const matchesStatus = !filterCriteria.status || task.status === filterCriteria.status;

            // Start Date filtering
            let matchesStartDate = true;
            if (filterCriteria.startDateComparison === "none") {
                matchesStartDate = !task.startDate; // Match tasks with no start date
            } else if (filterCriteria.startDate) {
                // Apply date comparison logic if startDate is provided and comparison isn't "none"
                matchesStartDate = filterByDate(task.startDate, filterCriteria.startDate, filterCriteria.startDateComparison);
            }

            // Due Date filtering
            let matchesDueDate = true;
            if (filterCriteria.dueDateComparison === "none") {
                matchesDueDate = !task.dueDate; // Match tasks with no due date
            } else if (filterCriteria.dueDate) {
                // Apply date comparison logic if dueDate is provided and comparison isn't "none"
                matchesDueDate = filterByDate(task.dueDate, filterCriteria.dueDate, filterCriteria.dueDateComparison);
            }

            // Return true if task matches all criteria
            return matchesPriority && matchesStatus && matchesStartDate && matchesDueDate;
        });
    };


    const clearFilters = () => {
        setFilterCriteria({
            priority: '',
            status: '',
            startDate: '',
            startDateComparison: '',
            dueDate: '',
            dueDateComparison: '',
        });
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilterCriteria(prev => ({ ...prev, [name]: value }));
    };

    const handleEditClick = (taskId) => {
        setIsEditing(taskId);
        const task = tasks.find(t => t.id === taskId);
        setEditedTask({ ...task });
    };

    const handleDeleteClick = async (taskId) => {
        const confirmation = window.confirm("Are you sure you want to delete this task?");
        if (confirmation) {
            try {
                await deleteTask(taskId);
                refreshTasks(); // Call this function to refresh the tasks in the parent component
            } catch (error) {
                console.error("Error deleting task:", error);
            }
        }
    };

    const handleSaveClick = async () => {
        try {
            await editTask(editedTask.id, editedTask);
            setIsEditing(null); // Exit edit mode
            refreshTasks(); // Refresh the tasks to reflect the edit
        } catch (error) {
            console.error("Error editing task:", error);
        }
    };
    return (
        <>
            <div className="filter-bar">
                <div className="filter-item">
                    <label htmlFor="priorityFilter">Priority:</label>
                    <select value={filterCriteria.priority} onChange={e => setFilterCriteria({ ...filterCriteria, priority: e.target.value })}>
                        <option value="">Show All</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>

                <div className="filter-item">
                    <label htmlFor="statusFilter">Status:</label>
                    <select value={filterCriteria.status} onChange={e => setFilterCriteria({ ...filterCriteria, status: e.target.value })}>
                        <option value="">Show All</option>
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                    </select>
                </div>
                {/* Start Date Filter */}
                <div className="filter-item">
                    <label htmlFor="startDateFilter">Start Date:</label>
                    <select
                        value={filterCriteria.startDateComparison}
                        onChange={e => setFilterCriteria({ ...filterCriteria, startDateComparison: e.target.value })}
                    >
                        <option value="">Show All</option>
                        <option value="before">Before</option>
                        <option value="before-equal">Before or Equal to</option>
                        <option value="equal">Equal to</option>
                        <option value="after">After</option>
                        <option value="after-equal">After or Equal to</option>
                        <option value="none">None Set</option>
                    </select>
                    <input
                        type="date"
                        value={filterCriteria.startDate}
                        onChange={e => setFilterCriteria({ ...filterCriteria, startDate: e.target.value })}
                    />
                </div>

                {/* Due Date Filter */}
                <div className="filter-item">
                    <label htmlFor="dueDateFilter">Due Date:</label>
                    <select
                        value={filterCriteria.dueDateComparison}
                        onChange={e => setFilterCriteria({ ...filterCriteria, dueDateComparison: e.target.value })}
                    >
                        <option value="">Show All</option>
                        <option value="before">Before</option>
                        <option value="before-equal">Before or Equal to</option>
                        <option value="equal">Equal to</option>
                        <option value="after">After</option>
                        <option value="after-equal">After or Equal to</option>
                        <option value="none">None Set</option>
                    </select>
                    <input
                        type="date"
                        value={filterCriteria.dueDate}
                        onChange={e => setFilterCriteria({ ...filterCriteria, dueDate: e.target.value })}
                    />
                </div>
                {/* Clear Filters Button */}
                <button onClick={clearFilters}>Clear Filters</button>
            </div>

            <table id="tasksTable">
                <thead>
                    <tr>
                        <th>Subject</th>
                        <th>Assignment</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Start Date</th>
                        <th>Due Date</th>
                        <th>Time Due</th>
                        <th>Project</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {getFilteredTasks(tasks, filterCriteria).map((task) => (
                        <tr key={task.id}>
                            <td>{task.subject}</td>
                            <td>{task.assignment}</td>
                            <td>
                                <select className={`priority-dropdown priority-${task.priority.toLowerCase()}`}>
                                    <option value="High" selected={task.priority === 'High'}>High</option>
                                    <option value="Medium" selected={task.priority === 'Medium'}>Medium</option>
                                    <option value="Low" selected={task.priority === 'Low'}>Low</option>
                                </select>
                            </td>
                            <td>
                                <select className={`status-dropdown status-${task.status.toLowerCase().replace(' ', '-')}`}>
                                    <option value="Not Started" selected={task.status === 'Not Started'}>Not Started</option>
                                    <option value="In Progress" selected={task.status === 'In Progress'}>In Progress</option>
                                    <option value="Completed" selected={task.status === 'Completed'}>Completed</option>
                                </select>
                            </td>
                            <td style={{ color: getDateColor(task.startDate) }}>{task.startDate}</td>
                            <td style={{ color: getDateColor(task.dueDate) }}>{task.dueDate}</td>
                            <td>{task.dueTime}</td>
                            <td>{task.project}</td>
                            <td>
                                <IconButton aria-label="edit">
                                    <EditIcon />
                                </IconButton>
                            </td>
                            <td>
                                <IconButton aria-label="delete" onClick={() => handleDeleteClick(task.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default TasksTable;
