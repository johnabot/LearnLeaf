function SubjectWidget({ subject, onArchive }) {
    const navigate = useNavigate();

    return (
        <div className="subject-widget">
            <h3>{subject.name}</h3>
            <p>{subject.semester}</p>
            <button onClick={() => navigate(`/subjects/${subject.id}`)}>Open</button>
            <button onClick={() => onArchive(subject.id)}>Archive</button>
        </div>
    );
}