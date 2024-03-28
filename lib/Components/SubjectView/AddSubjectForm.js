import React, { useState } from 'react';
import { addSubject } from '/src/LearnLeaf_Functions.jsx';
import { useUser } from '/src/UserState.jsx';
import '/src/Components/FormUI.css';
import '/src/Components/PageFormat.css';
export function AddSubjectForm({
  closeForm
}) {
  const {
    user
  } = useUser();
  const [subjectDetails, setSubjectDetails] = useState({
    userId: user.id,
    subjectName: '',
    semester: ''
  });
  const handleInputChange = e => {
    const {
      name,
      value
    } = e.target;
    setSubjectDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async e => {
    e.preventDefault();
    await addSubject(subjectDetails);
    closeForm();
  };
  return <div className="modal">
            <div className="task-form-container">
                <form onSubmit={handleSubmit}>
                    <h2 className="form-header">Add a New Subject</h2>
                    <div className="form-control">
                        <label htmlFor="subjectName">Subject Name:</label>
                        <input type="text" id="subjectName" name="subjectName" value={subjectDetails.subjectName} onChange={handleInputChange} required />
                    </div>
                    <div className="form-control">
                        <label htmlFor="semester">Semester:</label>
                        <input type="text" id="semester" name="semester" value={subjectDetails.semester} onChange={handleInputChange} required />
                    </div>
                    <button type="submit">Add Subject</button>
                    <button type="button" onClick={() => closeForm()}>Cancel</button>
                </form>
            </div>
        </div>;
}