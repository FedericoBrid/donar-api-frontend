import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

interface GuestRouteProps {
  children: ReactNode;
}

function GuestRoute({ children }: GuestRouteProps) {

    const {user, loading} = useAuth();

    if (loading) {
        return <div>Verificando sesión...</div>;
    }

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }
    return children;
}

export default GuestRoute;