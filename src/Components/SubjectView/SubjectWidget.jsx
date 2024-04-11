// @flow
import React from 'react';
import { archiveSubject } from '/src/LearnLeaf_Functions.jsx';
import './SubjectDashboard.css';

const SubjectWidget = ({ subject, refreshSubjects }) => { // Accept refreshSubjects as a prop

    const handleArchiveSubject = async () => {
        try {
            await archiveSubject(subject.id); // Assuming subject.id is available
            console.log("Subject archived successfully.");
            refreshSubjects(); // Call refreshSubjects to update the dashboard
        } catch (error) {
            console.error("Error archiving subject:", error);
        }
    };

    const widgetStyle = {
        border: `3px solid ${subject.subjectColor}`, // Using subject.color for the border
    };

    return (
        <div style={widgetStyle} key={subject.subjectName} className="subject-widget">
            <a
                href={`/subjects/${subject.subjectName}`}
                className="subject-name-link"
                onMouseEnter={() => {/* Tooltip logic here */ }}
                onMouseLeave={() => {/* Tooltip logic here */ }}
            >
                {subject.subjectName}
            </a>
            <div className="semester">{subject.semester}</div>
            {subject.status === "Active" && (
                <button className="archive-button" onClick={handleArchiveSubject}>
                    Archive
                </button>
            )}
        </div>
    );
}

export default SubjectWidget;
