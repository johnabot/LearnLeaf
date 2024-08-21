import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from './App.jsx';  // Assuming your routes are defined in App.jsx
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
import { ProtectedRoute } from './ProtectedRoutes.jsx';

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "/",
          element: <LoginForm />,
        },
        {
          path: "/register",
          element: <RegistrationForm />,
        },
        {
          path: "/resetPassword",
          element: <ResetPassword />,
        },
        {
          path: "/tasks",
          element: <ProtectedRoute><TaskList /></ProtectedRoute>,
        },
        {
          path: "/subjects",
          element: <ProtectedRoute><SubjectDashboard /></ProtectedRoute>,
        },
        {
          path: "/subjects/:subjectName",
          element: <ProtectedRoute><SubjectTasks /></ProtectedRoute>,
        },
        {
          path: "/projects",
          element: <ProtectedRoute><ProjectDashboard /></ProtectedRoute>,
        },
        {
          path: "/projects/:projectId",
          element: <ProtectedRoute><ProjectTasks /></ProtectedRoute>,
        },
        {
          path: "/profile",
          element: <ProtectedRoute><UserProfile /></ProtectedRoute>,
        },
        {
          path: "/archives",
          element: <ProtectedRoute><ArchiveDashboard /></ProtectedRoute>,
        },
        {
          path: "/calendar",
          element: <ProtectedRoute><CalendarView /></ProtectedRoute>,
        },
      ],
    },
  ],
  { basename: "/LearnLeaf" } // Set the basename to match your GitHub Pages repo name
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
