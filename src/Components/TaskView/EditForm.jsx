
import React, { useState, useEffect } from 'react';
import {editTask} from '/src/LearnLeaf_Functions.jsx';
import './TaskView.css';
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
        console.log('Task has been updated successfully.');
        onClose();
      } catch (error) {
        console.error('Failed to update task:', error);
      }
    };
  
    
    
     return (
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
  