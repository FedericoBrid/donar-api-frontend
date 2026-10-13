
import type { BloodRequest } from "../../types/BloodRequest";
import {
  formatDate,
  getStatusLabel,
  getUrgencyLabel,
} from "../../utils/bloodRequestUtils";

interface RequestCardsProps {
  requests: BloodRequest[];
}

function RequestCards({ requests }: RequestCardsProps) {
  if (requests.length === 0) {
    return <p>No hay solicitudes disponibles.</p>;
  }

  return (
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
            {getUrgencyLabel(request.urgency)}
          </p>

          <p>
            <strong>Estado:</strong>{" "}
            {getStatusLabel(request.status)}
          </p>

          <p>
            <strong>Vencimiento:</strong>{" "}
            {formatDate(request.expirationDate)}
          </p>
        </article>
      ))}
    </div>
  );
}

export default RequestCards;