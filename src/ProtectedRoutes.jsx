import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '/src/UserState.jsx';

export function ProtectedRoute({ children }) {
    const { user } = useUser(); // Assuming useAuth returns an object with user information

    if (!user) {
        // If there is no user, redirect to login
        return <Navigate to="/" replace />;
    }

    return children; // If user exists, render the children components
}
