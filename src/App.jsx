// @flow
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './Components/LoginForm/LoginForm.jsx';
import RegistrationForm from './Components/RegisterUser/RegisterForm.jsx';
import ResetPassword from './Components/ResetPassword/ResetPassword';
import TaskList from './Components/TaskView/TaskView'
import SubjectDashboard from './Components/SubjectView/SubjectDashboard.jsx';
import SubjectTasks from './Components/SubjectView/SubjectTasks.jsx';
import ProjectDashboard from './Components/ProjectView/ProjectDashboard.jsx';
import ProjectTasks from './Components/ProjectView/ProjectTasks.jsx';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/register" element={<RegistrationForm />} />
                <Route path="/resetPassword" element={<ResetPassword />} />
                <Route path="/tasks" element={<TaskList />} />
                <Route path="/subjects" element={<SubjectDashboard />} />
                <Route path="/subjects/:subjectName" element={<SubjectTasks />} />
                <Route path="/projects" element={<ProjectDashboard />} />
                <Route path="/projects/:projectName" element={<ProjectTasks />} />
                {/* Add more routes as needed */}
            </Routes>
        </Router>
    );
}

export default App;

