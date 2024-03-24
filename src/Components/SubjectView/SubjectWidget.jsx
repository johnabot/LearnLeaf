import './SubjectDashboard.css';

const SubjectWidget = ({ subject }) => {

    return (
        <div key={subject.subjectName} className="subject-widget">
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
                <button className="archive-button" onClick={() => {/* Archive logic here */ }}>
                    Archive
                </button>
            )}
        </div>
    );
}

export default SubjectWidget;
