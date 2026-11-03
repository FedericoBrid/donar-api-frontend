
import { useEffect, useState } from "react";
import { getBloodRequests } from "../../services/bloodRequestService";
import {
  getMyDonations,
  type MyDonation,
} from "../../services/donationService";
import type { BloodRequest } from "../../types/BloodRequest";
import RequestCards from "./RequestCards";
import { useAuth } from "../../context/useAuth";
import RequestTable from "./RequestTable";

type RequestsView = "cards" | "table";

function Requests() {
  const { user } = useAuth();

  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [donations, setDonations] = useState<MyDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState<RequestsView>("table");

  const canManageRequests =
    user?.roles.some((role) =>
      ["ADMIN", "HEMOADMIN"].includes(role),
    ) ?? false;

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const [requestsData, donationsData] = await Promise.all([
          getBloodRequests(),
          getMyDonations(),
        ]);

        if (active) {
          setRequests(requestsData);
          setDonations(donationsData);
        }
      } catch {
        if (active) {
          setError("No se pudieron cargar las solicitudes o tus donaciones.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      active = false;
    };
  }, []);

  // Actualiza las donaciones después de una inscripción exitosa.
  async function handleDonationRegistered() {
    const donationsData = await getMyDonations();
    setDonations(donationsData);
  }

  if (loading) {
    return <p>Cargando solicitudes...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  const pendingDonation = donations.find(
    (donation) => donation.donationStatus === "REGISTERED",
  );

  return (
    <section>
      <h2>Solicitudes de sangre</h2>

      {pendingDonation && (
        <p role="status">
          Ya tenés una inscripción pendiente para la solicitud #
          {pendingDonation.bloodRequestId}. Para inscribirte en otra,
          primero cancelá tu inscripción actual o esperá a completar
          la donación y cumplir el período de recuperación.
          Podés gestionarla desde Mis donaciones.
        </p>
      )}

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
        <RequestCards
          requests={requests}
          hasPendingDonation={Boolean(pendingDonation)}
          pendingBloodRequestId={pendingDonation?.bloodRequestId ?? null}
          onDonationRegistered={handleDonationRegistered}
        />
      )}
    </section>
  );
}

export default Requests;
