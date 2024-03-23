import React, { useState } from 'react';
import './TaskView.css';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// This component expects an array of tasks as a prop
const CustomIconButton = styled(IconButton)({
  border: '1px solid rgba(0, 0, 0, 0.23)', // Match the default Material-UI outlined border
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)', // Optional: change the hover background color
  },
});

const TasksTable = ({ tasks }) => {
  const [isEditing, setIsEditing] = useState(null);
  const [editedTask, setEditedTask] = useState({});
  // Placeholder for setTasks function
  const setTasks = (updatedTasks) => {
    console.log(updatedTasks); // Implement your state update logic here
  };

  const handleEditClick = (task, index) => {
    setIsEditing(index);
    setEditedTask({...task});
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
            <td>{task.timeDue}</td>
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
  );
};

export default TasksTable;
