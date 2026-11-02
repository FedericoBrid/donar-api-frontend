
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/useAuth";
import { getBloodRequestsByStatus } from "../../services/bloodRequestService";

function Dashboard() {
  const { user } = useAuth();

  const roles = user?.roles ?? [];

  const isAdmin = roles.includes("ADMIN");
  const isHemoAdmin = roles.includes("HEMOADMIN");

  const canManageDonations = isAdmin || isHemoAdmin;
  const canManageBloodCenters = isAdmin || isHemoAdmin;

  const [activeRequests, setActiveRequests] = useState(0);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchActiveRequests() {
      try {
        const data = await getBloodRequestsByStatus("ACTIVE");

        if (active) {
          setActiveRequests(data.length);
        }
      } catch {
        if (active) {
          setError("No se pudieron cargar las solicitudes activas.");
        }
      } finally {
        if (active) {
          setLoadingRequests(false);
        }
      }
    }

    void fetchActiveRequests();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section>
      <h2>Dashboard</h2>

      <div>
        <h3>¡Bienvenido, {user?.firstName}!</h3>
        <p>{user?.email}</p>
        <p>
          Roles: {roles.length > 0 ? roles.join(", ") : "Sin roles asignados"}
        </p>
      </div>

      <hr />

      <h3>Resumen general</h3>

      <div>
        <article>
          <h4>Solicitudes activas</h4>

          {loadingRequests ? (
            <p>Cargando...</p>
          ) : (
            <p>{activeRequests}</p>
          )}

          <Link to="/requests">Ver solicitudes</Link>
        </article>
      </div>

      {error && <p role="alert">{error}</p>}

      <hr />

      <h3>Accesos rápidos</h3>

      <div>
        <Link to="/requests">
          <button type="button">Ver solicitudes</button>
        </Link>

        <Link to="/donations">
          <button type="button">Mis donaciones</button>
        </Link>

        {canManageDonations && (
          <Link to="/donation-management">
            <button type="button">Gestión de donaciones</button>
          </Link>
        )}

        {canManageBloodCenters && (
          <Link to="/blood-centers">
            <button type="button">Gestión de hemocentros</button>
          </Link>
        )}

        {isAdmin && (
          <Link to="/users">
            <button type="button">Gestión de usuarios</button>
          </Link>
        )}
      </div>
    </section>
  );
}

export default Dashboard;
