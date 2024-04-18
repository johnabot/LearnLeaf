
import React, { useState, useEffect } from 'react';
import { editTask } from '/src/LearnLeaf_Functions.jsx';
import './TaskView.css';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';


const boxStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: '90vh', // Sets the height of the box to 90% of the viewport height
    maxHeight: '90vh', // Ensures the content doesn't exceed this height
    overflowY: 'auto', // Allows scrolling within the Box if content exceeds its height
    bgcolor: 'background.paper',
    boxShadow: 24,
    pt: 2, // Padding top
    pb: 3, // Padding bottom
    px: 4, // Padding left and right
};

const submitButtonStyle = {
    backgroundColor: '#B6CDC8', // Custom background color
    color: '#355147', // Custom text color
    '&:hover': {
        backgroundColor: '#a8bdb8', // Darker shade for hover state
    },
};

const cancelButtonStyle = {
    backgroundColor: 'transparent', // No background
    color: '#355147', // Custom text color
    marginLeft: 1, // Margin to the left
    '&:hover': {
        backgroundColor: '#a8bdb8', // Slight background on hover for visual feedback
    },
};

export const TaskEditForm = ({ task, isOpen, onClose, onSave }) => {
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
                startDateInput: formValues.startDate, // Align this with editTask expectations
                dueDateInput: formValues.dueDate,     // Align this with editTask expectations
                dueTimeInput: formValues.dueTime,     // Align this with editTask expectations
            };

            await editTask(updatedTaskData);
            onSave(updatedTaskData); // This needs to pass back the original formValues for consistency
            onClose();
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    };



    return (
        <Modal open={isOpen} onClose={onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <Box sx={boxStyle}>
                <h2 id="modal-modal-title" style={{ color: "#8E5B9F" }}>Edit Task</h2>
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
                        <Button sx={submitButtonStyle} onClick={handleSave}>
                            Save
                        </Button>
                        <Button sx={cancelButtonStyle} onClick={onClose}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </Box>
        </Modal>
    );
};
