// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode; // Los hijos que serán protegidos
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem('token'); // Recupera el token del local storage

  // Verifica si hay un token presente
  if (!token) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>; // Si hay un token, renderiza los hijos
};

export default ProtectedRoute;