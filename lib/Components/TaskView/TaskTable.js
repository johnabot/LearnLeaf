import React, { useState } from 'react';
import { editTask, deleteTask, fetchTasks } from '/src/LearnLeaf_Functions.jsx';
import { useUser } from '/src/UserState.jsx';
import './TaskView.css';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
const CustomIconButton = styled(IconButton)({
  border: '1px solid rgba(0, 0, 0, 0.23)',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)'
  }
});
const TasksTable = ({
  tasks,
  refreshTasks
}) => {
  const [isEditing, setIsEditing] = useState(null);
  const [editedTask, setEditedTask] = useState({});
  const handleEditClick = taskId => {
    setIsEditing(taskId);
    const task = tasks.find(t => t.id === taskId);
    setEditedTask({
      ...task
    });
  };
  const handleDeleteClick = async taskId => {
    const confirmation = window.confirm("Are you sure you want to delete this task?");
    if (confirmation) {
      try {
        await deleteTask(taskId);
        refreshTasks();
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };
  const handleSaveClick = async () => {
    try {
      await editTask(editedTask.id, editedTask);
      setIsEditing(null);
      refreshTasks();
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };
  return <table id="tasksTable">
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
                {tasks.map(task => <tr key={task.id}> {}
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
                            <CustomIconButton aria-label="edit" onClick={() => handleEditClick(task.taskId)}>
                                <EditIcon />
                            </CustomIconButton>
                        </td>
                        <td>
                            <CustomIconButton aria-label="delete" onClick={() => handleDeleteClick(task.taskId)}>
                                <DeleteIcon />
                            </CustomIconButton>
                        </td>
                    </tr>)}
            </tbody>
        </table>;
};
export default TasksTable;