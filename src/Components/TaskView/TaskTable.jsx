

import React, { useState, useEffect } from 'react';
import './TaskView.css';
import { editTask } from '../../LearnLeaf_Functions.jsx';
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


const CustomIconButton = styled(IconButton)({
  border: '1px solid rgba(0, 0, 0, 0.23)',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
});

const TasksTable = ({ tasks }) => {
  const [isEditing, setIsEditing] = useState(null);
  const [editedTask, setEditedTask] = useState({});
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  // Placeholder for setTasks function
  const setTasks = (updatedTasks) => {
    console.log(updatedTasks); // Implement your state update logic here
  };

  const handleEditClick = (task, index) => {
    setIsEditing(index);
    setEditedTask({...task});
    setEditModalOpen(true); // Open the edit modal
  };

  const handleDeleteClick = (index) => {
    const confirmation = window.confirm("Are you sure you want to delete this task?");
    if (confirmation) {
      const updatedTasks = tasks.filter((_, taskIndex) => taskIndex !== index);
      setTasks(updatedTasks);
    }
  };

  const handleSaveClick = (index) => {
      const updatedTasks = [...tasks];
      updatedTasks[index] = editedTask;
      alert(`Saving changes for: ${updatedTasks[index].subject}`);
      setTasks(updatedTasks);
      setIsEditing(null); // Exit edit mode
  };

  return (
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
          {tasks.map((task, index) => (
            <tr key={index}> {/* It's better to use a unique id if available */}
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
              <td>{task.startDate}</td>
              <td>{task.dueDate}</td>
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
                <CustomIconButton
                  aria-label="delete"
                  onClick={() => handleDeleteClick(index)}
                >
                  <DeleteIcon />
                </CustomIconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
          };

export default TasksTable;
  