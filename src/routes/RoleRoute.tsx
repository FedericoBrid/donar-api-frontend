import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

interface RoleRouteProps {
  allowedRoles: string[];
}

function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Verificando sesión...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const hasPermission = user.roles.some((role) =>
    allowedRoles.includes(role),
  );

  if (!hasPermission) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default RoleRoute;