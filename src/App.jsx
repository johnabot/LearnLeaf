// @flow
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './pages/LoginForm.jsx';
import RegistrationForm from './pages/RegisterForm.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import TaskList from './pages/TaskView.jsx';
import SubjectDashboard from './pages/SubjectDashboard.jsx';
import SubjectTasks from './pages/SubjectTasks.jsx';
import ProjectDashboard from './pages/ProjectDashboard.jsx';
import ProjectTasks from './pages/ProjectTasks.jsx';
import UserProfile from './pages/UserProfile.jsx';
import ArchiveDashboard from './pages/ArchiveDashboard';
import CalendarView from './pages/CalendarPage.jsx';
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
