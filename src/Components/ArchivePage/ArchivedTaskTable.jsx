// @flow
import React, { useState, useEffect } from 'react';
import { deleteTask, fetchTasks, formatDateDisplay, formatTimeDisplay } from '/src/LearnLeaf_Functions.jsx';
import { useUser } from '/src/UserState.jsx';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import './ArchiveDashboard.css';
import { TaskEditForm } from '/src/Components/TaskView/EditForm.jsx'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import format from 'date-fns/format';


const CustomIconButton = styled(IconButton)({
    border: '1px solid rgba(0, 0, 0, 0.23)',
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
});

function formatFormDate(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp.seconds * 1000);

    const utcYear = date.getUTCFullYear(); // Gets the year (4 digits for 4-digit years) in UTC
    const utcMonth = date.getUTCMonth() + 1; // getUTCMonth returns 0-11; add 1 to make it 1-12
    const utcDay = date.getUTCDate(); // Gets the day of the month (1-31) in UTC

    // Construct the date string in YYYY-MM-DD format
    return `${utcYear}-${String(utcMonth).padStart(2, '0')}-${String(utcDay).padStart(2, '0')}`;
}

function formatFormTime(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp.seconds * 1000);
    return format(date, 'HH:mm');
}


const TasksTable = ({ tasks, refreshTasks }) => {
    const [editedTask, setEditedTask] = useState({});
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [filterCriteria, setFilterCriteria] = useState({
        assignmentQuery: '',
        subjectQuery: '',
        projectQuery: '',
        dueDate: '',
        dueDateComparison: '',
    });

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
            const matchesAssignmentQuery = filterCriteria.assignmentQuery === '' || task.assignment.toLowerCase().includes(filterCriteria.assignmentQuery.toLowerCase());
            const matchesSubjectQuery = filterCriteria.subjectQuery === '' || task.subject.toLowerCase().includes(filterCriteria.subjectQuery.toLowerCase());
            const matchesProjectQuery = filterCriteria.projectQuery === '' || task.project.toLowerCase().includes(filterCriteria.projectQuery.toLowerCase());

            // Due Date filtering
            let matchesDueDate = true;
            if (filterCriteria.dueDateComparison === "none") {
                matchesDueDate = !task.dueDate; // Match tasks with no due date
            } else if (filterCriteria.dueDate) {
                // Apply date comparison logic if dueDate is provided and comparison isn't "none"
                matchesDueDate = filterByDate(task.dueDate, filterCriteria.dueDate, filterCriteria.dueDateComparison);
            }

            // Return true if task matches all criteria
            return matchesAssignmentQuery && matchesSubjectQuery && matchesProjectQuery && matchesDueDate;
        });

        return filteredTasks;
    };

    const clearFilters = () => {
        setFilterCriteria({
            assignmentQuery: '',
            subjectQuery: '',
            projectQuery: '',
            dueDate: '',
            dueDateComparison: '',
        });
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilterCriteria(prev => ({ ...prev, [name]: value }));
    };

    const handleEditClick = (task) => {
        // Format the due date and time only if they exist
        const formattedDueDate = task.dueDate ? formatFormDate(task.dueDate) : '';
        const formattedDueTime = task.dueTime ? formatFormTime(task.dueTime) : '';
        const formattedStartDate = task.startDate ? formatFormDate(task.startDate) : '';

        setEditedTask({
            ...task,
            dueDate: formattedDueDate,
            dueTime: formattedDueTime,
            startDate: formattedStartDate
        });

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
                    <label htmlFor="searchTask">Search by Assignment:</label>
                    <input
                        id="searchTask"
                        type="text"
                        placeholder="Search..."
                        onChange={(e) => setFilterCriteria({ ...filterCriteria, assignmentQuery: e.target.value })}
                    />
                </div>
                <div className="filter-item">
                    <label htmlFor="searchSubject">Search by Subject:</label>
                    <input
                        id="searchSubject"
                        type="text"
                        placeholder="Search..."
                        onChange={(e) => setFilterCriteria({ ...filterCriteria, subjectQuery: e.target.value })}
                    />
                </div>
                <div className="filter-item">
                    <label htmlFor="searchProject">Search by Project:</label>
                    <input
                        id="searchProject"
                        type="text"
                        placeholder="Search..."
                        onChange={(e) => setFilterCriteria({ ...filterCriteria, projectQuery: e.target.value })}
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
                        <th>Due Date</th>
                        <th>Due Time</th>
                        <th>Project</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {getFilteredTasks(tasks, filterCriteria).map((task, index) => (
                        <tr key={task.id || index}>
                            <td>{task.subject}</td>
                            <td>{task.assignment}</td>
                            <td> {task.dueDate ? formatDateDisplay(formatFormDate(task.dueDate)) : ''}</td>
                            <td> {task.dueTime ? formatTimeDisplay(formatFormTime(task.dueTime)) : ''}</td>
                            <td>{task.project}</td>
                            <td>

                                <CustomIconButton aria-label="edit" onClick={() => handleEditClick(task, index)}>
                                    <EditIcon />
                                </CustomIconButton>
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
}

export default TasksTable;