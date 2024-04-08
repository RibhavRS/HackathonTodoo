import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, children }) => {

    if(localStorage.getItem('token')=== null){
        return user ? children : <Navigate to="/login" replace />;
    } 
};

export default ProtectedRoute;