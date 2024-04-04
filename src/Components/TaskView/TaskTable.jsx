// @flow
import React, { useState, useEffect } from 'react';
import { editTask, deleteTask, fetchTasks } from '/src/LearnLeaf_Functions.jsx';
import { useUser } from '/src/UserState.jsx';
import './TaskView.css';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};
const TaskEditForm = ({ task, isOpen, onClose, onSave }) => {
    const [formValues, setFormValues] = useState(task);

    useEffect(() => {
        setFormValues({ ...task });
    }, [task]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormValues({ ...formValues, [name]: value });
    };
    const handleSave = async () => {
        try {
            const updatedTaskData = {
                taskId: formValues.taskId,
                userId: formValues.userId,
                subject: formValues.subject,
                project: formValues.project,
                assignment: formValues.assignment,
                priority: formValues.priority,
                status: formValues.status,
                startDate: formValues.startDate,
                dueDate: formValues.dueDate,
                dueTime: formValues.dueTime,
            };

            await editTask(updatedTaskData);
            onSave(updatedTaskData);
            console.log('Task has been updated successfully.');
            onClose();
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    };


    (
        <Modal open={isOpen} onClose={onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <Box sx={style}>
                <h2 id="modal-modal-title">Edit Task</h2>
                <form noValidate autoComplete="off">
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Subject"
                        name="subject"
                        value={formValues.subject}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Assignment"
                        name="assignment"
                        value={formValues.assignment}
                        onChange={handleChange}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="priority-label">Priority</InputLabel>
                        <Select
                            labelId="priority-label"
                            id="priority"
                            value={formValues.priority}
                            label="Priority"
                            name="priority"
                            onChange={handleChange}
                        >
                            <MenuItem value="High">High</MenuItem>
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="Low">Low</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="status-label">Status</InputLabel>
                        <Select
                            labelId="status-label"
                            id="status"
                            value={formValues.status}
                            label="Status"
                            name="status"
                            onChange={handleChange}
                        >
                            <MenuItem value="Not Started">Not Started</MenuItem>
                            <MenuItem value="In Progress">In Progress</MenuItem>
                            <MenuItem value="Completed">Completed</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Start Date"
                        name="startDate"
                        type="date"
                        value={formValues.startDate}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Due Date"
                        name="dueDate"
                        type="date"
                        value={formValues.dueDate}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Time Due"
                        name="dueTime"
                        type="time"
                        value={formValues.dueTime}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Project"
                        name="project"
                        value={formValues.project}
                        onChange={handleChange}
                    />
                    <div style={{ marginTop: 16 }}>
                        <Button variant="contained" color="primary" onClick={handleSave}>
                            Save
                        </Button>
                        <Button style={{ marginLeft: 8 }} onClick={onClose}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </Box>
        </Modal>
    );
};


const CustomIconButton = styled(IconButton)({
    border: '1px solid rgba(0, 0, 0, 0.23)',
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
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
        const filteredTasks = tasks.filter((task) => {
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

        // Debugging statement to log the filtered tasks and check if 'id' field is present
        console.log("Filtered tasks:", filteredTasks.map(task => ({ ...task, hasId: task.hasOwnProperty('id') })));

        return filteredTasks;
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


    // Placeholder for setTasks function
    const setTasks = (updatedTasks) => {
        console.log(updatedTasks); // Implement your state update logic here
    };

    const handleEditClick = (task, index) => {
        setIsEditing(index);
        setEditedTask({ ...task });
        setEditModalOpen(true); // Open the edit modal
    };
    const handleDeleteClick = async (taskId) => {
        console.log("Attempting to delete task with ID:", taskId);
        const confirmation = window.confirm("Are you sure you want to delete this task?");
        if (confirmation) {
            try {
                await deleteTask(taskId);
                refreshTasks(); // Call this function to refresh the tasks in the parent component
            } catch (error) {
                console.error("Error deleting task:", error);
            }
        }
    }
    const handleSaveClick = (index) => {
        const updatedTasks = [...tasks];
        updatedTasks[index] = editedTask;
        alert(`Saving changes for: ${updatedTasks[index].subject}`);
        setTasks(updatedTasks);
        setIsEditing(null); // Exit edit mode
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
            <div>
                <TaskEditForm
                    task={editedTask}
                    isOpen={isEditModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    onSave={(updatedTask) => {
                        const updatedTasks = tasks.map((task) =>
                            task.taskId === updatedTask.taskId ? updatedTask : task
                        );
                        setTasks(updatedTasks); // Update your state here
                        setEditModalOpen(false); // Close the edit modal
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
                                    <CustomIconButton
                                        aria-label="edit"
                                        onClick={() => handleEditClick(task, index)}
                                    >
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
            </div>

        </>
    );
};
export default TasksTable;