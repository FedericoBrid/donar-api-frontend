
import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import {
  BloodtypeOutlined,
  CalendarMonthOutlined,
  CheckCircleOutlined,
  LocationOnOutlined,
  PhoneOutlined,
  VolunteerActivismOutlined,
} from "@mui/icons-material";

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
    return (
      <Paper className="requests-empty">
        <BloodtypeOutlined sx={{ fontSize: 48, color: "text.secondary" }} />
        <Typography sx={{ variant: "h6", fontWeight: 600 }}>
          No hay solicitudes disponibles
        </Typography>
        <Typography color="text.secondary">
          Cuando haya nuevas solicitudes de sangre, aparecerán en esta sección.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box className="request-cards-grid">
      {requests.map((request) => {
        const message = messages[request.id];
        const isRegistering = registeringId === request.id;
        const isCurrentPendingRequest =
          hasPendingDonation && pendingBloodRequestId === request.id;

        const urgencyColor =
          request.urgency === "CRITICAL"
            ? "error"
            : request.urgency === "HIGH"
              ? "warning"
              : request.urgency === "MEDIUM"
                ? "info"
                : "success";

        return (
          <Card key={request.id} className="request-card" elevation={0}>
            <CardContent className="request-card-content">
              <Box className="request-card-header">
                <Box className="request-blood-group">
                  <BloodtypeOutlined />
                  <Typography sx={{ variant: "h5", fontWeight: 800 }}>
                    {request.bloodTypeName} {request.rhFactorName}
                  </Typography>
                </Box>

                <Chip
                  label={getUrgencyLabel(request.urgency)}
                  color={urgencyColor}
                  size="small"
                  variant="outlined"
                />
              </Box>

              <Divider />

              <Box className="request-card-information">
                <Box className="request-info-row">
                  <LocationOnOutlined color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Hemocentro
                    </Typography>
                    <Typography sx={{ fontWeight: 600 }}>
                      {request.bloodCenterName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {request.bloodCenterAddress}
                    </Typography>
                  </Box>
                </Box>

                <Box className="request-info-row">
                  <PhoneOutlined color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Teléfono
                    </Typography>
                    <Typography variant="body2">
                      {request.bloodCenterPhone}
                    </Typography>
                  </Box>
                </Box>

                <Box className="request-info-row">
                  <CalendarMonthOutlined color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Fecha de vencimiento
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(request.expirationDate)}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box className="request-card-footer">
                <Chip
                  label={getStatusLabel(request.status)}
                  color={request.status === "ACTIVE" ? "success" : "default"}
                  size="small"
                />

                {request.status === "ACTIVE" && (
                  <Button
                    variant="contained"
                    startIcon={<VolunteerActivismOutlined />}
                    disabled={isRegistering || hasPendingDonation}
                    onClick={() => void handleRegister(request.id)}
                    sx={{
                      backgroundColor: "#D71920",
                      "&:hover": { backgroundColor: "#A81219" },
                    }}
                  >
                    {isRegistering
                      ? "Inscribiendo..."
                      : isCurrentPendingRequest
                        ? "Ya estás inscripto"
                        : hasPendingDonation
                          ? "Ya tenés otra inscripción"
                          : "Quiero donar"}
                  </Button>
                )}
              </Box>

              {message && (
                <Alert
                  severity={message.type}
                  icon={
                    message.type === "success" ? (
                      <CheckCircleOutlined />
                    ) : undefined
                  }
                  sx={{ mt: 2, borderRadius: 2 }}
                >
                  {message.text}
                </Alert>
              )}
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
}

export default RequestCards;
