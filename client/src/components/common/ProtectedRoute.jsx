// This component will handle routes that require authentication
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, children }) => {
    if (!isAuthenticated) {
        // Redirect to login if not authenticated
        return <Navigate to='/login' replace />;
    }

    return children;
};

export default ProtectedRoute;