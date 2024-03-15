import React from 'react';
import './TaskView.css';


// This component expects an array of tasks as a prop
const TasksTable = ({ tasks }) => {
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
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TasksTable;