
import { useState } from "react";
import type { BloodRequest } from "../../types/BloodRequest";
import {
  formatDate,
  getStatusLabel,
  getUrgencyLabel,
} from "../../utils/bloodRequestUtils";
import { registerDonation } from "../../services/donationService";

interface RequestCardsProps {
  requests: BloodRequest[];
}

function RequestCards({ requests }: RequestCardsProps) {
  const [registeringId, setRegisteringId] = useState<number | null>(null);
  const [messages, setMessages] = useState<
    Record<number, { type: "success" | "error"; text: string }>
  >({});

  async function handleRegister(bloodRequestId: number) {
    setRegisteringId(bloodRequestId);

    setMessages((previous) => {
      const next = { ...previous };
      delete next[bloodRequestId];
      return next;
    });

    try {
      await registerDonation(bloodRequestId);

      setMessages((previous) => ({
        ...previous,
        [bloodRequestId]: {
          type: "success",
          text: "¡Te inscribiste correctamente para donar!",
        },
      }));
    } catch {
      setMessages((previous) => ({
        ...previous,
        [bloodRequestId]: {
          type: "error",
          text: "No se pudo completar la inscripción. Verificá las condiciones de la solicitud e intentá nuevamente.",
        },
      }));
    } finally {
      setRegisteringId(null);
    }
  }

  if (requests.length === 0) {
    return <p>No hay solicitudes disponibles.</p>;
  }

  return (
    <div>
      {requests.map((request) => {
        const message = messages[request.id];
        const isRegistering = registeringId === request.id;

        return (
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

            {request.status === "ACTIVE" && (
              <button
                type="button"
                disabled={isRegistering}
                onClick={() => void handleRegister(request.id)}
              >
                {isRegistering
                  ? "Inscribiendo..."
                  : "Quiero donar"}
              </button>
            )}

            {message && (
              <p
                role={message.type === "error" ? "alert" : "status"}
              >
                {message.text}
              </p>
            )}
          </article>
        );
      })}
    </div>
  );
}

export default RequestCards;
