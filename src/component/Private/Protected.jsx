import React from 'react';
import { Navigate } from 'react-router-dom';
import { UserState } from '../../context/UserContext';
import Loader from '../../Utiles/Loader';

const Protected = ({ children, allowedRoles }) => {
    const { user, loading } = UserState();

    if (user == null) {
        return <Loader />;
    }
    if (loading) {
        return <Loader />;
    }

        if (!user || !allowedRoles.includes(user.role)) {
            return <Navigate to="/manage/login" replace />;
        }

    return children;
}

export default Protected