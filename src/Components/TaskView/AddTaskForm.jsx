import React, { useState } from 'react';
import { addTask } from '/src/LearnLeaf_Functions.jsx';
import { useUser } from '/src/UserState.jsx';
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
    backgroundColor: '#B6CDC8',
    color: '#355147',
    '&:hover': {
        backgroundColor: '#a8bdb8',
    },
};

const cancelButtonStyle = {
    backgroundColor: 'transparent',
    color: '#355147',
    marginLeft: 1,
    '&:hover': {
        backgroundColor: '#a8bdb8',
    },
};

export function AddTaskForm({ isOpen, onClose, initialSubject, initialProject, refreshTasks }) {
    const { user } = useUser();
    const [taskDetails, setTaskDetails] = useState({
        userId: user.id,
        subject: initialSubject || '',
        assignment: '',
        priority: 'Medium',
        status: 'Not Started',
        startDateInput: '',
        dueDateInput: '',
        dueTimeInput: '',
        project: initialProject || '',
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setTaskDetails(prevDetails => ({ ...prevDetails, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addTask(taskDetails);
        onClose();
        refreshTasks();
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box sx={boxStyle}>
                <h2 style={{ color: "#8E5B9F" }}>Add a New Task</h2>
                <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                    <TextField fullWidth margin="normal" label="Subject" name="subject" value={taskDetails.subject} onChange={handleInputChange} />
                    <TextField fullWidth margin="normal" label="Assignment" name="assignment" value={taskDetails.assignment} onChange={handleInputChange} required />

                    <FormControl fullWidth margin="normal">
                        <InputLabel id="priority-label">Priority</InputLabel>
                        <Select labelId="priority-label" id="priority" value={taskDetails.priority} name="priority" onChange={handleInputChange}>
                            <MenuItem value="High">High</MenuItem>
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="Low">Low</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel id="status-label">Status</InputLabel>
                        <Select labelId="status-label" id="status" value={taskDetails.status} name="status" onChange={handleInputChange}>
                            <MenuItem value="Not Started">Not Started</MenuItem>
                            <MenuItem value="In Progress">In Progress</MenuItem>
                            <MenuItem value="Completed">Completed</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField fullWidth margin="normal" label="Start Date" name="startDateInput" type="date" value={taskDetails.startDateInput} onChange={handleInputChange} InputLabelProps={{ shrink: true }} />
                    <TextField fullWidth margin="normal" label="Due Date" name="dueDateInput" type="date" value={taskDetails.dueDateInput} onChange={handleInputChange} InputLabelProps={{ shrink: true }} />
                    <TextField fullWidth margin="normal" label="Time Due" name="dueTimeInput" type="time" value={taskDetails.dueTimeInput} onChange={handleInputChange} InputLabelProps={{ shrink: true }} />
                    <TextField fullWidth margin="normal" label="Project" name="project" value={taskDetails.project} onChange={handleInputChange} />

                    <div style={{ marginTop: 16 }}>
                        <Button sx={submitButtonStyle} type="submit">
                            Add Task
                        </Button>
                        <Button sx={cancelButtonStyle} onClick={onClose}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </Box>
        </Modal>
    );
}
