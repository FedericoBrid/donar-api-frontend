
import { useEffect, useState } from "react";
import { getBloodRequests } from "../../services/bloodRequestService";
import type { BloodRequest } from "../../types/BloodRequest";
import RequestCards from "./RequestCards";
import { useAuth } from "../../context/useAuth";
import RequestTable from "./RequestTable";

type RequestsView = "cards" | "table";

function Requests() {
  const { user } = useAuth();
  
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState<RequestsView>("table");

  const canManageRequests = 
    user?.roles.some((role) =>
        ["ADMIN", "HEMOADMIN"].includes(role),
      ) ?? false;

  useEffect(() => {
    async function loadRequests() {
      try {
        const data = await getBloodRequests();
        setRequests(data);
      } catch {
        setError("No se pudieron cargar las solicitudes.");
      } finally {
        setLoading(false);
      }
    }

    void loadRequests();
  }, []);

  if (loading) {
    return <p>Cargando solicitudes...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  return (
    <section>
      <h2>Solicitudes de sangre</h2>
      {canManageRequests && (
        <div>
          <button
            type="button"
            onClick={() => setView("table")}
            disabled={view === "table"}
          >
            Gestionar solicitudes
          </button>

          <button
            type="button"
            onClick={() => setView("cards")}
            disabled={view === "cards"}
          >
            Buscar dónde donar
          </button>
        </div>
      )}

      {canManageRequests && view === "table" ? (
        <RequestTable requests={requests} />
      ) : (
        <RequestCards requests={requests} />
      )}
    </section>
  );
}

export default Requests;