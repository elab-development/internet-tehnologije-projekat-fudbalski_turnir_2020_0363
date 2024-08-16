import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = window.sessionStorage.getItem('auth_token');
  
  return token!=="null" && token!==undefined && token!==null ? children : <Navigate to="/" />;
};

export default PrivateRoute;
