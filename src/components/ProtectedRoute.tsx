// src/components/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem('authToken');
  const location = useLocation(); // <-- 1. Captura a localização atual

  if (!token) {
    // 2. Redireciona para /login, passando a localização original no 'state'
    return <Navigate 
             to="/login" 
             replace 
             state={{ from: location, message: 'Você precisa estar logado para acessar esta página.' }} 
           />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;