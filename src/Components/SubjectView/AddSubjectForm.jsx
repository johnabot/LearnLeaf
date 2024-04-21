import React, { useState } from 'react';
import { addSubject } from '/src/LearnLeaf_Functions.jsx';
import { useUser } from '/src/UserState.jsx';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { ChromePicker } from 'react-color'; // Make sure you've installed react-color


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


export function AddSubjectForm({ isOpen, onClose, refreshSubjects }) {
    const { user } = useUser();
    const [subjectDetails, setSubjectDetails] = useState({
        userId: user.id,
        subjectName: '',
        semester: '',
        subjectColor: 'black',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSubjectDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleColorChange = (color) => {
        setSubjectDetails(prev => ({ ...prev, subjectColor: color.hex }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addSubject(subjectDetails);
        onClose(); // Close the form
        await refreshSubjects(); // Refresh the subjects list to reflect the new addition
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box sx={boxStyle}>
                <h2 style={{ color: "#8E5B9F" }}>Add a New Subject</h2>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        id="subjectName"
                        name="subjectName"
                        label="Subject Name"
                        value={subjectDetails.subjectName}
                        onChange={handleInputChange}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        id="semester"
                        name="semester"
                        label="Semester"
                        value={subjectDetails.semester}
                        onChange={handleInputChange}
                    />
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
                        <ChromePicker
                            color={subjectDetails.subjectColor}
                            onChangeComplete={handleColorChange}
                        />
                    </div>
                    <div style={{ marginTop: 16 }}>
                        <Button sx={submitButtonStyle} type="submit" variant="contained">
                            Add Subject
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
