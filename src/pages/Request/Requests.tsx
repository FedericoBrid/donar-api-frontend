import { useEffect, useState } from "react";
import { getBloodRequests } from "../../services/bloodRequestService";
import type { BloodRequest } from "../../types/BloodRequest";

function Requests() {
    const [requests, setRequests] = useState<BloodRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadRequests() {
            try {
                const data = await getBloodRequests();
                setRequests(data);
            } catch (error) {
                setError("No se pudieron cargar las solicitudes.");
            } finally {
                setLoading(false);
            }
        }
        loadRequests();
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

      {requests.length === 0 ? (
        <p>No hay solicitudes disponibles.</p>
      ) : (
        <div>
          {requests.map((request) => (
            <article key={request.id}>
              <h3>
                {request.bloodTypeName} {request.rhFactorName}
              </h3>

              <p>
                <strong>Hemocentro:</strong>{" "}
                {request.bloodCenterName}
              </p>

              <p>
                <strong>Dirección:</strong>{" "}
                {request.bloodCenterAddress}
              </p>

              <p>
                <strong>Teléfono:</strong>{" "}
                {request.bloodCenterPhone}
              </p>

              <p>
                <strong>Urgencia:</strong>{" "}
                {request.urgency}
              </p>

              <p>
                <strong>Estado:</strong>{" "}
                {request.status}
              </p>

              <p>
                <strong>Vencimiento:</strong>{" "}
                {request.expirationDate}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
export default Requests;