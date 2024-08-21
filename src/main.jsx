import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import LoginForm from './pages/LoginForm.jsx';
import RegistrationForm from './pages/RegisterForm.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import TaskList from './pages/TaskView.jsx';
import SubjectDashboard from './pages/SubjectDashboard.jsx';
import SubjectTasks from './pages/SubjectTasks.jsx';
import ProjectDashboard from './pages/ProjectDashboard.jsx';
import ProjectTasks from './pages/ProjectTasks.jsx';
import UserProfile from './pages/UserProfile.jsx';
import ArchiveDashboard from './pages/ArchiveDashboard.jsx';
import CalendarView from './pages/CalendarPage.jsx';

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        { path: "/", element: <LoginForm /> },
        { path: "/register", element: <RegistrationForm /> },
        { path: "/resetPassword", element: <ResetPassword /> },
        { path: "/tasks", element: <TaskList /> },
        { path: "/subjects", element: <SubjectDashboard /> },
        { path: "/subjects/:subjectName", element: <SubjectTasks /> },
        { path: "/projects", element: <ProjectDashboard /> },
        { path: "/projects/:projectId", element: <ProjectTasks /> },
        { path: "/profile", element: <UserProfile /> },
        { path: "/archives", element: <ArchiveDashboard /> },
        { path: "/calendar", element: <CalendarView /> },
      ],
    },
  ],
  { basename: "/LearnLeaf" }
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
