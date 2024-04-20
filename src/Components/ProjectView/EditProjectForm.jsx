import React, { useState, useEffect } from 'react';
import { editProject } from '/src/LearnLeaf_Functions.jsx'; // Ensure you have this function defined similarly to addProject
import { useUser } from '/src/UserState.jsx';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

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

export const EditProjectForm = ({ project, isOpen, onClose, onSave }) => {
    const [formValues, setFormValues] = useState({
        projectId: project.id,
        ...project,
    });

    useEffect(() => {
        setFormValues({ ...project });
    }, [project]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedProjectData = {
                projectId: formValues.projectId,
                userId: formValues.userId,
                projectName: formValues.projectName,
                subject: formValues.subject,
                status: project.status,
                projectDueDateInput: formValues.projectDueDate,
                projectDueTimeInput: formValues.projectDueTime,
            };
            console.log(updatedProjectData);

            await editProject(updatedProjectData);
            onSave(updatedProjectData); // Callback to update the parent component's state with the new project data
            console.log('Project has been updated successfully.');
            onClose(); // Close the modal after saving
        } catch (error) {
            console.error('Failed to update project:', error);
        }

    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box sx={boxStyle}>
                <h2 style={{ color: "#8E5B9F" }}>Edit Project</h2>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Project Name"
                        name="projectName"
                        value={formValues.projectName}
                        onChange={handleInputChange}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Subject"
                        name="subject"
                        value={formValues.subject}
                        onChange={handleInputChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Due Date"
                        name="projectDueDate"
                        type="date"
                        value={formValues.projectDueDate}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Time Due"
                        name="projectDueTime"
                        type="time"
                        value={formValues.projectDueTime}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                    />
                    <div style={{ marginTop: 16 }}>
                        <Button sx={submitButtonStyle} type="submit" variant="contained">Save Changes</Button>
                        <Button sx={cancelButtonStyle} onClick={onClose}>Cancel</Button>
                    </div>
                </form>
            </Box>
        </Modal>
    );
};