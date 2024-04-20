import React, { useState, useEffect } from 'react';
import { editSubject } from '/src/LearnLeaf_Functions.jsx';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { ChromePicker } from 'react-color';

const boxStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    pt: 2,
    pb: 3,
    px: 4,
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

export const EditSubjectForm = ({ subject, isOpen, onClose, onSave }) => {
    const [formValues, setFormValues] = useState({
        subjectId: subject.id,
        ...subject,
    });

    useEffect(() => {
        setFormValues({
            ...formValues,
            ...subject
        });
    }, [subject]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormValues(prev => ({ ...prev, [name]: value }));
    };

    const handleColorChange = (color) => {
        setFormValues(prev => ({ ...prev, subjectColor: color.hex }));
    };

    const handleSave = async (event) => {
        event.preventDefault(); // Prevent the form from causing a page reload
        try {
            const updatedSubjectData = {
                subjectId: formValues.subjectId,
                userId: formValues.userId,
                subjectName: formValues.subjectName,
                semester: formValues.semester,
                subjectColor: formValues.subjectColor,
                status: formValues.status,
            };
            await editSubject(updatedSubjectData);
            onSave(updatedSubjectData); // Callback to update the parent component's state with the new subject data
            console.log('Subject has been updated successfully.');
            onClose(); // Close the modal after saving
        } catch (error) {
            console.error('Failed to update subject:', error);
        }
    };


    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box sx={boxStyle}>
                <h2 style={{ color: "#8E5B9F" }}>Edit Subject</h2>
                <form noValidate autoComplete="off" onSubmit={handleSave}>
                    <TextField
                        fullWidth
                        margin="normal"
                        name="subjectName"
                        label="Subject Name"
                        value={formValues.subjectName}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        name="semester"
                        label="Semester"
                        value={formValues.semester}
                        onChange={handleChange}
                    />
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
                        <ChromePicker
                            color={formValues.subjectColor || '#fff'}
                            onChangeComplete={handleColorChange}
                        />
                    </div>
                    <div style={{ marginTop: 16 }}>
                        <Button type="submit" sx={submitButtonStyle} variant="contained">
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
