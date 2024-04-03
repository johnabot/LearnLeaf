import React, { useState } from 'react';
import { addProject } from '/src/LearnLeaf_Functions.jsx';
import { useUser } from '/src/UserState.jsx';
import '/src/Components/FormUI.css';
import '/src/Components/PageFormat.css';
export function AddProjectForm({
  closeForm,
  initialSubject,
  initialProjectName
}) {
  const {
    user
  } = useUser();
  const [projectDetails, setProjectDetails] = useState({
    userId: user.id,
    projectName: initialProjectName || '',
    subject: initialSubject || '',
    projectDueDate: '',
    projectDueTime: ''
  });
  const handleInputChange = e => {
    const {
      name,
      value
    } = e.target;
    setProjectDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async e => {
    e.preventDefault();
    await addProject(projectDetails);
    closeForm();
  };
  return <div className="modal">
            <div className="task-form-container">
                <form onSubmit={handleSubmit}>
                    <h2 className="form-header">Add a New Project</h2>
                    <div className="form-control">
                        <label htmlFor="projectName">Project Name:</label>
                        <input type="text" id="projectName" name="projectName" value={projectDetails.projectName} onChange={handleInputChange} required />
                    </div>
                    <div className="form-control">
                        <label htmlFor="subject">Subject:</label>
                        <input type="text" id="subject" name="subject" value={projectDetails.subject} onChange={handleInputChange} required />
                    </div>
                    <div className="form-row">
                        <div className="form-control">
                            <label htmlFor="projectDueDateInput">Due Date:</label>
                            <input type="date" id="projectDueDateInput" name="projectDueDateInput" value={projectDetails.projectDueDateInput} onChange={handleInputChange} />
                        </div>

                        <div className="form-control">
                            <label htmlFor="projectDueTimeInput">Time Due:</label>
                            <input type="time" id="projectDueTimeInput" name="projectDueTimeInput" value={projectDetails.projectDueTimeInput} onChange={handleInputChange} />
                        </div>
                    </div>
                    <button type="submit">Add Project</button>
                    <button type="button" onClick={() => closeForm()}>Cancel</button>
                </form>
            </div>
        </div>;
}