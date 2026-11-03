
import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import {
  TableChartOutlined,
  VolunteerActivismOutlined,
} from "@mui/icons-material";

import "./Requests.css";

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

  async function handleDonationRegistered() {
    const donationsData = await getMyDonations();
    setDonations(donationsData);
  }

  const pendingDonation = donations.find(
    (donation) => donation.donationStatus === "REGISTERED",
  );

  if (loading) {
    return (
      <Box className="requests-loading">
        <CircularProgress sx={{ color: "#D71920" }} />
        <Typography color="text.secondary">
          Cargando solicitudes...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="requests-page">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box className="requests-page">
      <Box className="requests-header">
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Solicitudes de sangre
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Consultá las solicitudes disponibles y encontrá dónde donar.
          </Typography>
        </Box>
      </Box>

      {pendingDonation && (
        <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
          <Typography sx={{ fontWeight: 600 }} component="span">
            Tenés una inscripción pendiente.
          </Typography>{" "}
          Estás inscripto en la solicitud #{pendingDonation.bloodRequestId}.
          Para inscribirte en otra, primero cancelá tu inscripción actual o
          esperá a completar la donación y cumplir el período de recuperación.
          Podés gestionarla desde Mis donaciones.
        </Alert>
      )}

      {canManageRequests && (
        <Box className="requests-view-selector">
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={(_, nextView: RequestsView | null) => {
              if (nextView) setView(nextView);
            }}
            color="primary"
            aria-label="Vista de solicitudes"
          >
            <ToggleButton value="table">
              <TableChartOutlined sx={{ mr: 1 }} />
              Gestionar solicitudes
            </ToggleButton>

            <ToggleButton value="cards">
              <VolunteerActivismOutlined sx={{ mr: 1 }} />
              Buscar dónde donar
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
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
    </Box>
  );
}

export default Requests;
