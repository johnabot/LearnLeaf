import React, { useState } from 'react';
import { addTask } from '/src/LearnLeaf_Functions.js';
import { useUser } from '/src/UserState.jsx';

export function PopupForm({ subjects, projects, onSubmit, closeForm }) {
    const { user } = useUser(); // Use useContext hook to access the current user
    const [isVisible, setIsVisible] = useState(false);
    const [taskDetails, setTaskDetails] = useState({
        userId: user.id,
        subject: '',
        assignment: '',
        priority: '',
        status: '',
        startDate: '',
        dueDate: '',
        dueTime: '',
        project: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTaskDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addTask( taskDetails); // Pass id from UserContext
        setIsVisible(false);
        if (typeof closeForm === 'function') {
            closeForm();
        }
    };

    return (
        <>
            {isVisible && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setIsVisible(false)}>&times;</span>
                        <form onSubmit={handleSubmit}>
                            <input type="string" name="subject" onChange={handleInputChange} value={taskDetails.subject} />
                            <input type="string" name="assignment" onChange={handleInputChange} value={taskDetails.assignment} required/>
                            <input type="date" name="startDate" onChange={handleInputChange} value={taskDetails.startDate} />
                            <input type="date" name="dueDate" onChange={handleInputChange} value={taskDetails.dueDate} require/>
                            <input type="time" name="dueTime" onChange={handleInputChange} value={taskDetails.dueTime} />
                            <input type="string" name="project" onChange={handleInputChange} value={taskDetails.project} />

                            <select name="priority" onChange={handleInputChange} value={taskDetails.priority}>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                                <option value="">None</option>
                            </select>

                            <select name="status" onChange={handleInputChange} value={taskDetails.status} >
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
