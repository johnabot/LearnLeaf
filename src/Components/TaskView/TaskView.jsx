import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Correct imports based on your file structure
import TasksTable from './TaskTable';
import { useUser } from '/src/UserState.jsx'; // Adjust the path based on your file structure

function FloatingActionButton({ onClick }) {
    return (
      <button className="fab" onClick={onClick}>
        +
      </button>
    );
}

const TaskList = () => {
    const [showForm, setShowForm] = useState(false);
    const [tasks, setTasks] = useState([]);
    const { user } = useUser();

    useEffect(() => {
        const fetchedTasks = [
            {
                subject: 'CIS-330',
                assignment: 'Chapter 2 Review - Create Shell in C', // Note: Changed 'assignment' to 'name' for consistency
                priority: 'Low',
                status: 'In Progress',
                startDate: '01-Jan-2021',
                dueDate: '05-Jan-2021',
                timeDue: '11:59 PM'
            },
            {
                subject: 'CIS-330',
                assignment: 'Quiz 1', // Note: Changed 'assignment' to 'name' for consistency
                priority: 'High',
                status: 'Not Started',
                startDate: '02-Jan-2021',
                dueDate: '06-Jan-2021',
                timeDue: '5:30 PM'
            },
            {
                subject: 'IT-230',
                project: 'Group 5: Ethics',
                assignment: 'Part A', // Note: Changed 'assignment' to 'name' for consistency
                priority: 'Medium',
                status: 'Completed',
                startDate: '01-Feb-2021',
                dueDate: '05-Feb-2021',
                timeDue: '8:00 AM'
            }
        ];
        setTasks(fetchedTasks);
    }, []);

    const handleSubmit = (event) => {
      event.preventDefault();
      const { subject, assignment, priority, status, startDate, dueDate, timeDue, project } = event.target.elements;
  
      const newTask = {
          subject: subject.value,
          assignment: assignment.value, // Corrected from 'name' to 'assignment' for consistency
          priority: priority.value,
          status: status.value,
          startDate: startDate.value,
          dueDate: dueDate.value,
          timeDue: timeDue.value,
          project: project.value
      };
  
      setTasks([...tasks, newTask]);
      setShowForm(false);
  };

    return (
      <div className="task-view-container">
          <div className="top-bar">
              <img src="src/LearnLeaf_Logo_Circle.png" alt="Logo" className="logo" />
              <div className="app-name"><h1>LearnLeaf Organizer</h1></div>
              <nav className="nav-links">
                  <a href="/calendar">Calendar</a>
                  <a href="/projects">Projects</a>
                  <a href="/subjects">Subjects</a>
                  <a href="/archives">Archives</a>
                  <a href="/profile">User Profile</a>
              </nav>
          </div>
          <FloatingActionButton onClick={() => setShowForm(true)} />

          {showForm && (
              <div className="task-form-container">
                  <form onSubmit={handleSubmit} className="task-form">
                      <input type="text" name="subject" placeholder="Subject" required />
                      <input type="text" name="assignment" placeholder="Assignment" required />
                      <select name="priority">
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                      </select>
                      <select name="status">
                          <option value="Not Started">Not Started</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                      </select>
                      <input type="date" name="startDate" required />
                      <input type="date" name="dueDate" required />
                      <input type="time" name="timeDue" required />
                      <input type="text" name="project" placeholder="Project Name" />
                      <button type="submit">Add Task</button>
                      <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
                  </form>
              </div>
          )}

          <div>
              <h1 style={{color: '#907474'}}>{user.name}'s Upcoming Tasks</h1>
              <TasksTable tasks={tasks} />
          </div>
      </div>
    );
};
export default TaskList;