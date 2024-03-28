import React from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import './ProjectDashboard.css';
const ProjectWidget = ({
  project
}) => {
  const colors = [' #355147', '#5B8E9F', '#F3161E'];
  const data = [{
    name: 'Completed',
    value: project.numCompleted
  }, {
    name: 'In Progress',
    value: project.numInProgress
  }, {
    name: 'Not Started',
    value: project.numNotStarted
  }];
  return <div key={project.projectId} className="project-widget">
            <a href={`/projects/${project.projectName}`} className="project-name-link" onMouseEnter={() => {}} onMouseLeave={() => {}}>
                {project.projectName}
            </a>
                <div className="subject-info">Subject: {project.subject}</div>

                {project.nextTaskName ? <div className="next-task">Next Task: {project.nextTaskName} due {project.nextTaskDueDate} at {project.nextTaskDueTime}</div> : <div className="next-task">No tasks added</div>}

                {project.numCompleted + project.numInProgress + project.numNotStarted > 0 && <PieChart width={400} height={200}> {}
                        <Pie data={data} cx="40%" cy="50%" outerRadius={80} innerRadius={50} fill="#8884d8" dataKey="value">
                            {data.map((entry, index) => <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend layout="vertical" verticalAlign="middle" align="right" /> {}
                    </PieChart>}

                <div className="project-due">Project Due: {project.projectDueDate} at {project.projectDueTime}</div>
                {project.status === "Active" && <button className="archive-button" onClick={() => {}}>
                        Archive
                    </button>}
            </div>;
};
export default ProjectWidget;