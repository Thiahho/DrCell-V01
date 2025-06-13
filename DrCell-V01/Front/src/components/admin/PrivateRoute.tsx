import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  if (!token || usuario.rol !== 'ADMIN') {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

export default PrivateRoute;
