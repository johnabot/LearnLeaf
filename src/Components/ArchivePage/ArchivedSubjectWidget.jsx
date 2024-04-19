// @flow
import React, { useState, useEffect } from 'react';
import { deleteSubject } from '/src/LearnLeaf_Functions.jsx';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { EditSubjectForm } from '/src/Components/SubjectView/EditSubjectForm.jsx';
import './ArchiveDashboard.css';

const CustomIconButton = styled(IconButton)({
    '&:hover': {
        backgroundColor: '#9F6C5B',
    },
});

const SubjectWidget = ({ subject, reactivateSubject, refreshSubjects }) => {
    const [editedSubject, setEditedSubject] = useState({
        subjectId: subject.id,
        ...subject,
    });
    const [isEditModalOpen, setEditModalOpen] = useState(false);

    const handleEditClick = (subject) => {
        setEditedSubject({ ...subject });
        setEditModalOpen(true); // Open the edit modal
    };
    const handleDeleteClick = async () => {
        const confirmation = window.confirm("Are you sure you want to delete this subject?");
        if (confirmation) {
            try {
                await deleteSubject(subject.id);
                refreshSubjects(); // Call this function to refresh the subjects in the parent component
            } catch (error) {
                console.error("Error deleting subject:", error);
            }
        }
    };

    const handleReactivateSubject = async () => {
        try {
            await reactivateSubject(subject.id);
            console.log("Subject reactivated successfully.");
            refreshSubjects();
        } catch (error) {
            console.error("Error archiving subject:", error);
        }
    };

    return (
        <>
            <EditSubjectForm
                subject={editedSubject}
                isOpen={isEditModalOpen}
                onClose={() => setEditModalOpen(false)}
                onSave={(updatedSubject) => {
                    refreshSubjects();
                    setEditModalOpen(false);
                }}
            />
            <div className="subject-widget">
                <div className="subject-name">
                    {subject.subjectName}
                </div>
                <div className="semester">{subject.semester}</div>
                <div className="subject-buttons">
                    {subject.status === "Archived" && (
                        <button className="archive-button" onClick={handleReactivateSubject}>
                            Reactivate
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
