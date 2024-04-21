// @flow
import React, { useState, useEffect } from 'react';
import { archiveSubject, deleteSubject } from '/src/LearnLeaf_Functions.jsx';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { EditSubjectForm } from './EditSubjectForm.jsx';
import './SubjectDashboard.css';

const CustomIconButton = styled(IconButton)({
    '&:hover': {
        backgroundColor: '#9F6C5B',
    },
});

const SubjectWidget = ({ subject, refreshSubjects }) => {
    const [editedSubject, setEditedSubject] = useState({
        subjectId: subject.id,
        ...subject,
    });
    const [isEditModalOpen, setEditModalOpen] = useState(false);

    const handleArchiveSubject = async () => {
        try {
            await archiveSubject(subject.id);
            console.log("Subject archived successfully.");
            refreshSubjects(); // Call refreshSubjects to update the dashboard
        } catch (error) {
            console.error("Error archiving subject:", error);
        }
    };

    const widgetStyle = {
        border: `3px solid ${subject.subjectColor}`, // Using subject.color for the border
    };

    const handleEditClick = (subject) => {
        setEditedSubject({ ...subject });
        setEditModalOpen(true); // Open the edit modal
    };
    const handleDeleteClick = async () => {
        const confirmation = window.confirm("Are you sure you want to delete this subject?\n(This will not delete any associated tasks.)");
        if (confirmation) {
            try {
                await deleteSubject(subject.id);
                refreshSubjects(); // Call this function to refresh the subjects in the parent component
            } catch (error) {
                console.error("Error deleting subject:", error);
            }
        }
    };

    return (
        <>
            <EditSubjectForm
                key={editedSubject.subjectId}
                subject={editedSubject}
                isOpen={isEditModalOpen}
                onClose={() => setEditModalOpen(false)}
                onSave={() => {
                    setEditModalOpen(false);
                    refreshSubjects();
                }}
            />
            <div style={widgetStyle} className="subject-widget">
                <a
                    href={`/subjects/${subject.subjectName}`}
                    className="subject-name-link"
                    onMouseEnter={() => {/* Tooltip logic here */ }}
                    onMouseLeave={() => {/* Tooltip logic here */ }}
                >
                    {subject.subjectName}
                </a>
                <div className="semester">{subject.semester}</div>
                <div className="subject-buttons">
                    {subject.status === "Active" && (
                        <button className="archive-button" onClick={handleArchiveSubject}>
                            Archive
                        </button>
                    )}
                    <CustomIconButton aria-label="edit" onClick={() => handleEditClick(subject)}>
                        <EditIcon />
                    </CustomIconButton>
                    <CustomIconButton aria-label="delete" onClick={() => handleDeleteClick(subject.subjectId)}>
                        <DeleteIcon />
                    </CustomIconButton>
                </div>
            </div>
        </>
    );

}

export default SubjectWidget;
