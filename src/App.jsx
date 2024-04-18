// @flow
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './Components/LoginForm/LoginForm.jsx';
import RegistrationForm from './Components/RegisterUser/RegisterForm.jsx';
import ResetPassword from './Components/ResetPassword/ResetPassword';
import TaskList from './Components/TaskView/TaskView';
import SubjectDashboard from './Components/SubjectView/SubjectDashboard.jsx';
import SubjectTasks from './Components/SubjectView/SubjectTasks.jsx';
import ProjectDashboard from './Components/ProjectView/ProjectDashboard.jsx';
import ProjectTasks from './Components/ProjectView/ProjectTasks.jsx';
import UserProfile from './Components/UserProfile/UserProfile_TEMP.jsx';
import ArchiveDashboard from './Components/ArchivePage/ArchiveDashboard';
import CalendarView from './Components/CalendarPage/CalendarPage.jsx';
import { ProtectedRoute } from './ProtectedRoutes.jsx';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/register" element={<RegistrationForm />} />
                <Route path="/resetPassword" element={<ResetPassword />} />
                <Route path="/tasks" element={<ProtectedRoute><TaskList /></ProtectedRoute>} />
                <Route path="/subjects" element={<ProtectedRoute><SubjectDashboard /></ProtectedRoute>} />
                <Route path="/subjects/:subjectName" element={<ProtectedRoute><SubjectTasks /></ProtectedRoute>} />
                <Route path="/projects" element={<ProtectedRoute><ProjectDashboard /></ProtectedRoute>} />
                <Route path="/projects/:projectId" element={<ProtectedRoute><ProjectTasks /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                <Route path="/archives" element={<ProtectedRoute><ArchiveDashboard /></ProtectedRoute>} />
                <Route path="/calendar" element={<ProtectedRoute><CalendarView /></ProtectedRoute>} />
                {/* Add more routes as needed */}
            </Routes>
        </Router>
    );
}

export default App;
