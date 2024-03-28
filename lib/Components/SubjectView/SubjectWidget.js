import './SubjectDashboard.css';
const SubjectWidget = ({
  subject
}) => {
  return <div key={subject.subjectName} className="subject-widget">
            <a href={`/subjects/${subject.subjectName}`} className="subject-name-link" onMouseEnter={() => {}} onMouseLeave={() => {}}>
                {subject.subjectName}
            </a>
            <div className="semester">{subject.semester}</div>
            {subject.status === "Active" && <button className="archive-button" onClick={() => {}}>
                    Archive
                </button>}
        </div>;
};
export default SubjectWidget;