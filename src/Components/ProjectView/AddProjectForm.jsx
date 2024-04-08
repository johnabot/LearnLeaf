import React, { useState } from 'react';
import { addProject } from '/src/LearnLeaf_Functions.jsx';
import { useUser } from '/src/UserState.jsx';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

// Styles
const boxStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
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

export function AddProjectForm({ isOpen, onClose, refreshProjects }) {
    const { user } = useUser();
    const [projectDetails, setProjectDetails] = useState({
        userId: user.id,
        projectName: '',
        subject: '',
        projectDueDateInput: '',
        projectDueTimeInput: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProjectDetails({ ...projectDetails, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addProject(projectDetails);
        onClose(); // Close the form
        await refreshProjects(); // Refresh the subjects list to reflect the new addition
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box sx={boxStyle}>
                <h2 style={{ color: "#8E5B9F" }}>Add a New Project</h2>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Project Name"
                        name="projectName"
                        value={projectDetails.projectName}
                        onChange={handleInputChange}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Subject"
                        name="subject"
                        value={projectDetails.subject}
                        onChange={handleInputChange}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Due Date"
                        name="projectDueDateInput"
                        type="date"
                        value={projectDetails.projectDueDateInput}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Time Due"
                        name="projectDueTimeInput"
                        type="time"
                        value={projectDetails.projectDueTimeInput}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                    />
                    <div style={{ marginTop: 16 }}>
                        <Button sx={submitButtonStyle} type="submit" variant="contained" onClick={handleSubmit}>Add Project</Button>
                        <Button sx={cancelButtonStyle} onClick={onClose}>Cancel</Button>
                    </div>
                </form>
            </Box>
        </Modal>
    );
}