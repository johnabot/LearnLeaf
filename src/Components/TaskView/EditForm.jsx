
import React, { useState, useEffect } from 'react';
import { editTask, fetchSubjects, addSubject, fetchProjects, addProject } from '/src/LearnLeaf_Functions.jsx';
import { useUser } from '/src/UserState.jsx';
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
    const { user } = useUser();
    const [formValues, setFormValues] = useState(task);
    const [subjects, setSubjects] = useState([]);
    const [projects, setProjects] = useState([]);
    const [isNewSubject, setIsNewSubject] = useState(false);
    const [isNewProject, setIsNewProject] = useState(false);
    const [newSubjectName, setNewSubjectName] = useState('');
    const [newProjectName, setNewProjectName] = useState('');

    useEffect(() => {
        setFormValues({ ...task });
        async function loadSelections() {
            const fetchedSubjects = await fetchSubjects(user.id);
            setSubjects(fetchedSubjects);
            const fetchedProjects = await fetchProjects(user.id);
            setProjects(fetchedProjects);
        }
        loadSelections();
    }, [task, user.id]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        const isNewItemSelected = value === "newSubject" || value === "newProject";

        if (name === "subject") {
            if (isNewItemSelected) {
                setIsNewSubject(value === "newSubject");
                setFormValues(prevDetails => ({ ...prevDetails, subject: '' }));
            } else {
                setIsNewSubject(false);
                setFormValues(prevDetails => ({ ...prevDetails, subject: value }));
            }
        } else if (name === "newSubjectName" && isNewSubject) {
            setFormValues(prevDetails => ({ ...prevDetails, subject: value }));
        }

        if (name === "project") {
            if (isNewItemSelected) {
                setIsNewProject(value === "newProject");
                setFormValues(prevDetails => ({ ...prevDetails, project: '' }));
            } else {
                setIsNewProject(false);
                setFormValues(prevDetails => ({ ...prevDetails, project: value }));
            }
        } else if (name === "newProjectName" && isNewProject) {
            setFormValues(prevDetails => ({ ...prevDetails, project: value }));
        }

        // Handle all other inputs normally
        if (!["subject", "project", "newSubjectName", "newProjectName"].includes(name)) {
            setFormValues(prevDetails => ({ ...prevDetails, [name]: value }));
        }
    };

    const handleSave = async () => {
        try {
            const updatedTaskDetails = {
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

            // Check if "None" was selected for subject or project and replace with an empty string
            if (updatedTaskDetails.subject === "None") {
                updatedTaskDetails.subject = '';
            }
            if (updatedTaskDetails.project === "None") {
                updatedTaskDetails.project = '';
            }

            if (isNewSubject && newSubjectName) {
                const newSubjectDetails = {
                    userId: user.id,
                    subjectName: newSubjectName,
                    semester: '',
                    subjectColor: 'black' // Default color
                };
                await addSubject(newSubjectDetails);
                updatedTaskDetails.subject = newSubjectName;
            }

            if (isNewProject && newProjectName) {
                const newProjectDetails = {
                    userId: user.id,
                    projectName: newProjectName,
                    subject: ''
                };
                await addProject(newProjectDetails);
                updatedTaskDetails.project = newProjectName;
            }

            await editTask(updatedTaskDetails);
            onSave(updatedTaskDetails); // This needs to pass back the original formValues for consistency
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
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="subject-label">Subject</InputLabel>
                        <Select
                            labelId="subject-label"
                            id="subject"
                            name="subject"
                            value={isNewSubject ? 'newSubject' : formValues.subject}
                            onChange={handleInputChange}
                            required
                        >
                            <MenuItem value="None">None</MenuItem>
                            {subjects.map(subject => (
                                <MenuItem key={subject.subjectName} value={subject.subjectName}>{subject.subjectName}</MenuItem>
                            ))}
                            <MenuItem value="newSubject">Add New Subject...</MenuItem>
                        </Select>
                    </FormControl>
                    {isNewSubject && (
                        <TextField
                            fullWidth
                            margin="normal"
                            label="New Subject Name"
                            name="newSubjectName"
                            value={newSubjectName}
                            onChange={(e) => setNewSubjectName(e.target.value)}
                            required
                        />
                    )}
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Assignment"
                        name="assignment"
                        value={formValues.assignment ? formValues.assignment : ''}
                        onChange={handleInputChange}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="priority-label">Priority</InputLabel>
                        <Select
                            labelId="priority-label"
                            id="priority"
                            value={formValues.priority? formValues.priority : ''}
                            label="Priority"
                            name="priority"
                            onChange={handleInputChange}
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
                            value={formValues.status? formValues.status : ''}
                            label="Status"
                            name="status"
                            onChange={handleInputChange}
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
                        value={formValues.startDate ? formValues.startDate : ''}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Due Date"
                        name="dueDate"
                        type="date"
                        value={formValues.dueDate ? formValues.dueDate : ''}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Time Due"
                        name="dueTime"
                        type="time"
                        value={formValues.dueTime ? formValues.dueTime : ''}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="project-label">Project</InputLabel>
                        <Select
                            labelId="project-label"
                            id="project"
                            name="project"
                            value={isNewProject ? 'newProject' : formValues.project}
                            onChange={handleInputChange}
                            required
                        >
                            <MenuItem value="None">None</MenuItem>
                            {projects.map(project => (
                                <MenuItem key={project.projectName} value={project.projectName}>{project.projectName}</MenuItem>
                            ))}
                            <MenuItem value="newProject">Add New Project...</MenuItem>
                        </Select>
                    </FormControl>
                    {isNewProject && (
                        <TextField
                            fullWidth
                            margin="normal"
                            label="New Project Name"
                            name="newProjectName"
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            required
                        />
                    )}
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
