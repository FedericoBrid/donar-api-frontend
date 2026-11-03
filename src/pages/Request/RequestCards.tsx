
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
  hasPendingDonation: boolean;
  pendingBloodRequestId: number | null;
  onDonationRegistered: () => Promise<void>;
}

function RequestCards({
  requests,
  hasPendingDonation,
  pendingBloodRequestId,
  onDonationRegistered,
}: RequestCardsProps) {
  const [registeringId, setRegisteringId] = useState<number | null>(null);

  const [messages, setMessages] = useState<
    Record<number, { type: "success" | "error"; text: string }>
  >({});

  async function handleRegister(bloodRequestId: number) {
    if (hasPendingDonation || registeringId !== null) {
      return;
    }

    setRegisteringId(bloodRequestId);

    setMessages((previous) => {
      const next = { ...previous };
      delete next[bloodRequestId];
      return next;
    });

    try {
      await registerDonation(bloodRequestId);

      // Volvemos a consultar las inscripciones del usuario.
      await onDonationRegistered();

      setMessages((previous) => ({
        ...previous,
        [bloodRequestId]: {
          type: "success",
          text: "¡Te inscribiste correctamente para donar!",
        },
      }));
    } catch (error) {
      console.error("Error al registrar la donación:", error);

      setMessages((previous) => ({
        ...previous,
        [bloodRequestId]: {
          type: "error",
          text: "No se pudo completar la inscripción. Intentá nuevamente.",
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
        const isCurrentPendingRequest =
          hasPendingDonation && pendingBloodRequestId === request.id;

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
                disabled={isRegistering || hasPendingDonation}
                onClick={() => void handleRegister(request.id)}
              >
                {isRegistering
                  ? "Inscribiendo..."
                  : isCurrentPendingRequest
                    ? "Ya estás inscripto"
                    : hasPendingDonation
                      ? "Ya tenés otra inscripción pendiente"
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
