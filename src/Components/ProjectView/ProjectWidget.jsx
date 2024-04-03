import React from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import './ProjectDashboard.css';

const ProjectWidget = ({ project }) => {
    const colors = ['#355147', '#5B8E9F', '#F3161E']; // Example colors for the chart

    // Adjusted to use statusCounts from project object
    const data = [
        { name: 'Completed', value: project.statusCounts.Completed },
        { name: 'In Progress', value: project.statusCounts.InProgress },
        { name: 'Not Started', value: project.statusCounts.NotStarted },
    ];

    return (
        <div key={project.projectId} className="project-widget">
            <Link to={`/projects/${project.projectName}`} className="project-name-link">
                {project.projectName}
            </Link>
            <div className="subject-info">Subject: {project.subject}</div>

            {project.nextTaskName ? (
                <div className="next-task">Next Task: {project.nextTaskName}<br/>Due: {project.nextTaskDueDate} at {project.nextTaskDueTime}</div>
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

            <div className="project-due">Project Due: {project.projectDueDate} at {project.projectDueTime}</div>
            {project.status === "Active" && (
                <button className="archive-button">
                    Archive
                </button>
            )}
        </div>
    );
};

export default ProjectWidget;
