import React, { useState } from 'react';

export function PopupForm ({ subjects, projects, onSubmit, closeForm }) {
  const [isVisible, setIsVisible] = useState(false);
  const [taskDetails, setTaskDetails] = useState({
    subject: '',
    assignment: '',
    priority: '',
    status: '',
    startDate: '',
    dueDate: '',
    timeDue: '',
    project: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(taskDetails); // Implement the logic to add task to Firebase here
    setIsVisible(false); // Close the popup form
  };

  return (
    <>
      <button onClick={() => setIsVisible(true)}>Create Task</button>
      {isVisible && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsVisible(false)}>&times;</span>
            <form onSubmit={handleSubmit}>
                <input type="string" name="subject" onChange={handleInputChange} value={taskDetails.subject} />
                <input type="string" name="assignment" onChange={handleInputChange} value={taskDetails.assignment} />
                <input type="date" name="startDate" onChange={handleInputChange} value={taskDetails.startDate}  required/>
                <input type="date" name="dueDate" onChange={handleInputChange} value={taskDetails.dueDate} />
                <input type="time" name="timeDue" onChange={handleInputChange} value={taskDetails.timeDue} />
                <input type="string" name="project" onChange={handleInputChange} value={taskDetails.project} />
                
                <select name="priority" onChange={handleInputChange} value={taskDetails.priority}>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                    <option value="">None</option>
                </select>
                
                <select name="status" onChange={handleInputChange} value={taskDetails.status} required>
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
                
                <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
