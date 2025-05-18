// PrivateRoute.tsx
import { Navigate, Outlet } from 'react-router';

const PrivateRoute = () => {
  const token = localStorage.getItem('token');
  const isOnboarded = localStorage.getItem('isOnboarded') === 'true';

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!isOnboarded) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
