// @flow
import React, { useState } from 'react';
import { addSubject } from '/src/LearnLeaf_Functions.jsx';
import { useUser } from '/src/UserState.jsx';
import '/src/Components/FormUI.css';
import '/src/Components/PageFormat.css';

// Include refreshSubjects in the props
export function AddSubjectForm({ closeForm, refreshSubjects }) {
    const { user } = useUser();
    const [subjectDetails, setSubjectDetails] = useState({
        userId: user.id,
        subjectName: '',
        semester: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSubjectDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addSubject(subjectDetails);
        closeForm(); // Close the form
        await refreshSubjects(); // Refresh the subjects list to reflect the new addition
    };

    return (
        <div className="modal">
            <div className="subject-form-container">
                <form onSubmit={handleSubmit}>
                    <h2 className="form-header">Add a New Subject</h2>
                    <div className="form-control">
                        <input
                            type="text"
                            id="subjectName"
                            name="subjectName"
                            value={subjectDetails.subjectName}
                            onChange={handleInputChange}
                            placeholder="Subject Name"
                            required
                        />
                    </div>
                    <div className="form-control">
                        <input
                            type="text"
                            id="semester"
                            name="semester"
                            value={subjectDetails.semester}
                            onChange={handleInputChange}
                            placeholder="Semester"
                        />
                    </div>
                    <button type="submit">Add Subject</button>
                    <button type="button" onClick={closeForm}>Cancel</button>
                </form>
            </div>
        </div>
    );
}
