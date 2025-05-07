import React from 'react';
import { UserState } from '../context/UserContext';
import { Navigate } from 'react-router-dom';
import Loader from '../Utiles/Loader';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = UserState();

  if (loading) {
    return <Loader />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login-as" replace />;
  }
  return children;
};

export default ProtectedRoute;