import React from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { archiveProject, formatDateDisplay, formatTimeDisplay } from '/src/LearnLeaf_Functions.jsx';
import './ProjectDashboard.css';

const ProjectWidget = ({ project, refreshProjects }) => {
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
            refreshProjects(); // This will trigger the refresh in the parent component
        } catch (error) {
            console.error("Error archiving project:", error);
        }
    };

    return (
        <div key={project.projectId} className="project-widget">
            <Link to={`/projects/${project.projectName}`} className="project-name-link">
                {project.projectName}
            </Link>
            <div className="subject-info">Subject: {project.subject}</div>

            {project.nextTaskName ? (
                <div className="next-task">Next Task: {project.nextTaskName}<br />Due: {formatDateDisplay(project.nextTaskDueDate)} at {formatTimeDisplay(project.nextTaskDueTime)}</div>
            ) : (
                <div className="next-task">No Upcoming Tasks</div>
            )}

            {data.some(entry => entry.value > 0) && ( // Only display pie chart if there's at least one task
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

            <div className="project-due">Project Due: {formatDateDisplay(project.projectDueDate)} at {formatTimeDisplay(project.projectDueTime)}</div>
            {project.status === "Active" && (
                <button className="archive-button" onClick={handleArchiveProject}>
                    Archive
                </button>
            )}
        </div>
    );
};

export default ProjectWidget;
