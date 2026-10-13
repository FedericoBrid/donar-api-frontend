
import { useEffect, useState } from "react";
import { getBloodRequests } from "../../services/bloodRequestService";
import type { BloodRequest } from "../../types/BloodRequest";
import RequestCards from "./RequestCards";

function Requests() {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      <RequestCards requests={requests} />
    </section>
  );
}

export default Requests;