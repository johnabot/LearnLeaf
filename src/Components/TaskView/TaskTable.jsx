// @flow
import React, { useState, useEffect } from 'react';
import { deleteTask, fetchTasks, formatDateDisplay, formatTimeDisplay } from '/src/LearnLeaf_Functions.jsx';
import { useUser } from '/src/UserState.jsx';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import './TaskView.css';
import { TaskEditForm } from '/src/Components/TaskView/EditForm.jsx'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';

const CustomIconButton = styled(IconButton)({
    border: '1px solid rgba(0, 0, 0, 0.23)',
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
});



const TasksTable = ({ tasks, refreshTasks }) => {
    const [editedTask, setEditedTask] = useState({});
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [filterCriteria, setFilterCriteria] = useState({
        searchQuery: '',
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
                return taskDate === filterDate;
            case 'after':
                return taskDate > filterDate;
            case 'after-equal':
                return taskDate >= filterDate;
            default:
                return true;
        }
    };

    const getFilteredTasks = (tasks, filterCriteria) => {
        const filteredTasks = tasks.filter((task) => {
            // Search filter
            const matchesSearchQuery = filterCriteria.searchQuery === '' || task.assignment.toLowerCase().includes(filterCriteria.searchQuery.toLowerCase());

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
            return matchesSearchQuery && matchesPriority && matchesStatus && matchesStartDate && matchesDueDate;
        });

        return filteredTasks;
    };

    const clearFilters = () => {
        setFilterCriteria({
            searchQuery: '',
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


    // Placeholder for setTasks function
    const setTasks = (updatedTasks) => {
    };

    const handleEditClick = (task) => {
        setEditedTask({ ...task });
        setEditModalOpen(true); // Open the edit modal
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

    return (
        <>
            <div className="filter-bar">
                <div className="filter-item">
                    <label htmlFor="searchTask">Search:</label>
                    <input
                        id="searchTask"
                        type="text"
                        placeholder="Search tasks..."
                        onChange={(e) => setFilterCriteria({ ...filterCriteria, searchQuery: e.target.value })}
                    />
                </div>
                <div className="filter-item">
                    <label htmlFor="priorityFilter">Priority:</label>
                    <select
                        id="priorityFilter"
                        value={filterCriteria.priority}
                        onChange={(e) => setFilterCriteria({ ...filterCriteria, priority: e.target.value })}
                    >
                        <option value="">Show All</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>

                <div className="filter-item">
                    <label htmlFor="statusFilter">Status:</label>
                    <select
                        id="statusFilter"
                        value={filterCriteria.status}
                        onChange={(e) => setFilterCriteria({ ...filterCriteria, status: e.target.value })}
                    >
                        <option value="">Show All</option>
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>

                <div className="filter-item">
                    <label htmlFor="startDateFilter">Start Date:</label>
                    <select
                        id="startDateFilter"
                        value={filterCriteria.startDateComparison}
                        onChange={(e) => setFilterCriteria({ ...filterCriteria, startDateComparison: e.target.value })}
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
                        onChange={(e) => setFilterCriteria({ ...filterCriteria, startDate: e.target.value })}
                    />
                </div>

                <div className="filter-item">
                    <label htmlFor="dueDateFilter">Due Date:</label>
                    <select
                        id="dueDateFilter"
                        value={filterCriteria.dueDateComparison}
                        onChange={(e) => setFilterCriteria({ ...filterCriteria, dueDateComparison: e.target.value })}
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
                        onChange={(e) => setFilterCriteria({ ...filterCriteria, dueDate: e.target.value })}
                    />
                </div>

                <button onClick={clearFilters}>Clear Filters</button>
            </div>

            <TaskEditForm
                key={editedTask.taskId}
                task={editedTask}
                isOpen={isEditModalOpen}
                onClose={() => setEditModalOpen(false)}
                onSave={(updatedTask) => {
                    const updatedTasks = tasks.map((task) =>
                        task.taskId === updatedTask.taskId ? updatedTask : task
                    );
                    setTasks(updatedTasks);
                    setEditModalOpen(false);
                    refreshTasks();
                }}
            />

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
                    {getFilteredTasks(tasks, filterCriteria).map((task, index) => (
                        <tr key={task.taskId || index}>
                        <td style={{ color: task.subjectColor || 'transparent' }}>
                            {task.subject}
                        </td>
                        <td style={{ color: task.subjectColor || 'transparent' }}>
                            {task.assignment}
                        </td>
                        <td>{task.priority}</td>
                        <td>{task.status}</td>
                        <td style={{ color: getDateColor(task.startDate) }}>
                            {task.startDate ? formatDateDisplay(task.startDate) : '--/--/----'}
                        </td>
                        <td style={{ color: getDateColor(task.dueDate) }}>
                            {task.dueDate ? formatDateDisplay(task.dueDate) : '--/--/----'}
                        </td>
                        <td>{task.dueTime ? formatTimeDisplay(task.dueTime) : '--:--'}</td>
                        <td>{task.project}</td>
                        <td>
                            <CustomIconButton aria-label="edit" onClick={() => handleEditClick(task)}>
                            <EditIcon />
                            </CustomIconButton>
                        </td>
                        <td>
                            <IconButton aria-label="delete" onClick={() => handleDeleteClick(task.taskId)}>
                            <DeleteIcon />
                            </IconButton>
                        </td>
                        </tr>
                    ))}
                    </tbody>
            </table>
        </>
    );
}

export default TasksTable;