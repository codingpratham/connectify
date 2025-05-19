import { Navigate, Outlet, useLocation } from "react-router";

const PrivateRoute = () => {
  const token = localStorage.getItem("token");
  const isOnboarded = localStorage.getItem("isOnboarded") === "true";
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!isOnboarded && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  if (isOnboarded && location.pathname === "/onboarding") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
