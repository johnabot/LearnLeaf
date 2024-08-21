import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { archiveProject, deleteProject, formatDateDisplay, formatTimeDisplay } from '/src/LearnLeaf_Functions.jsx';
import ProjectTasks from '/src/pages/ProjectTasks.jsx';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { EditProjectForm } from './EditProjectForm.jsx';
import './ProjectDashboard.css';

const CustomIconButton = styled(IconButton)({
    '&:hover': {
        backgroundColor: '#9F6C5B',
    },
});

const ProjectWidget = ({ project, refreshProjects }) => {
    const [editedProject, setEditedProject] = useState({
        projectId: project.id,
        ...project,
    });
    const [isEditModalOpen, setEditModalOpen] = useState(false);

    const colors = ['#355147', '#5B8E9F', '#F3161E'];

    // Adjusted to use statusCounts from project object
    const data = [
        { name: 'Completed', value: project.statusCounts.Completed },
        { name: 'In Progress', value: project.statusCounts.InProgress },
        { name: 'Not Started', value: project.statusCounts.NotStarted },
    ];

    const handleArchiveProject = async () => {
        try {
            await archiveProject(project.projectId);
            console.log("Project archived successfully.");
            refreshProjects();
        } catch (error) {
            console.error("Error archiving project:", error);
        }
    };

    const handleEditClick = (project) => {
        setEditedProject({ ...project });
        setEditModalOpen(true);
    };

    const handleDeleteClick = async (projectId) => {
        const confirmation = window.confirm("Are you sure you want to delete this project?\n(This will not delete any associated tasks.)");
        if (confirmation) {
            try {
                await deleteProject(projectId);
                refreshProjects(); // Refresh the project list in the parent component
            } catch (error) {
                console.error("Error deleting project:", error);
            }
        }
    };

    const handleProjectClick = (project) => {
        ProjectTasks(project);

        // Then navigate
        navigate(`/projects/${project.projectName}`);
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
                <Link to={`/projects/${project.projectId}`} className="project-name-link">
                    {project.projectName}
                </Link>
                {project.subject ? (
                    <div className="subject-info">Subject: {project.subject}</div>
                ) : (
                    <div className="subject-info"> </div>
                )}

                {project.nextTaskName ? (
                    <div className="next-task">
                        Next Task: {project.nextTaskName}
                        {project.nextTaskDueDate ? (
                            <React.Fragment>
                                <br />Due: {formatDateDisplay(project.nextTaskDueDate)}
                                {project.nextTaskDueTime && ` at ${formatTimeDisplay(project.nextTaskDueTime)}`}
                            </React.Fragment>
                        ) : (
                                <span> <br />No Due Date Set</span> // Display when no due date is provided
                        )}
                    </div>
                ) : (
                    <div className="next-task">No Upcoming Tasks</div>
                )}


                {data.some(entry => entry.value > 0) && (
                    <PieChart width={400} height={200}>
                        <Pie
                            data={data}
                            cx="40%"
                            cy="50%"
                            outerRadius={80}
                            innerRadius={50}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend layout="vertical" verticalAlign="middle" align="right" />
                    </PieChart>
                )}
                {project.projectDueDate ? (
                    <div className="project-due">
                        Project Due: {formatDateDisplay(project.projectDueDate)}
                        {project.projectDueTime && ` at ${formatTimeDisplay(project.projectDueTime)}`}
                    </div>
                ) : (
                    <div className="project-due">No Due Date Set</div>
                )}
                <div className="project-buttons">
                    {project.status === "Active" && (
                        <button className="archive-button" onClick={handleArchiveProject}>
                            Archive
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
