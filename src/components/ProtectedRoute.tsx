import type  { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';


const ProtectedRoute = ({ isAuthenticated, children }: {
  isAuthenticated: boolean;
  children: ReactNode;
}) => {
 if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default ProtectedRoute