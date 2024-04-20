import React, { useState } from 'react';
import { deleteProject, formatDateDisplay } from '/src/LearnLeaf_Functions.jsx';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { EditProjectForm } from '/src/Components/ProjectView/EditProjectForm.jsx';
import './ArchiveDashboard.css';

const CustomIconButton = styled(IconButton)({
    '&:hover': {
        backgroundColor: '#9F6C5B',
    },
});

const ProjectWidget = ({ project, reactivateProject, refreshProjects }) => {
    const [editedProject, setEditedProject] = useState({
        projectId: project.id,
        ...project,
    });
    const [isEditModalOpen, setEditModalOpen] = useState(false);

    const handleEditClick = (project) => {
        setEditedProject({ ...project });
        setEditModalOpen(true);
    };

    const handleDeleteClick = async (projectId) => {
        const confirmation = window.confirm("Are you sure you want to delete this project?");
        if (confirmation) {
            try {
                await deleteProject(projectId);
                refreshProjects(); // Refresh the project list in the parent component
            } catch (error) {
                console.error("Error deleting project:", error);
            }
        }
    };

    const handleReactivateProject = async () => {
        try {
            await reactivateProject(project.projectId);
            console.log("Project reactivated successfully.");
            refreshProjects();
        } catch (error) {
            console.error("Error archiving project:", error);
        }
    };

    return (
        <>
            <EditProjectForm
                project={editedProject}
                isOpen={isEditModalOpen}
                onClose={() => setEditModalOpen(false)}
                onSave={(updatedProject) => {
                    refreshProjects();
                    setEditModalOpen(false);
                }}
            />
            <div className="project-widget">
                <div className="project-name">
                    {project.projectName}
                </div>
                {project.subject ? (
                    <div className="subject-info">Subject: {project.subject}</div>
                ) : (
                    <div className="subject-info"> </div>
                )}

                {project.projectDueDate ? (
                    <div className="project-due">Project Due: {project.projectDueDate ? formatDateDisplay(project.projectDueDate) : ''}</div>
                ) : (
                    <div className="project-due"> </div>
                )}
                <div className="project-buttons">
                    {project.status === "Archived" && (
                        <button className="archive-button" onClick={handleReactivateProject}>
                            Reactivate
                        </button>
                    )}
                    <CustomIconButton aria-label="edit" onClick={() => handleEditClick(project)}>
                        <EditIcon />
                    </CustomIconButton>
                    <CustomIconButton aria-label="delete" onClick={() => handleDeleteClick(project.projectId)}>
                        <DeleteIcon />
                    </CustomIconButton>
                </div>
            </div>
        </>
    );
};

export default ProjectWidget;
