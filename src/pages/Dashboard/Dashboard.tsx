
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Typography,
} from "@mui/material";

import {
  Bloodtype as BloodtypeIcon,
  VolunteerActivism as DonationIcon,
  CheckCircleOutlined as CompletedIcon,
  CancelOutlined as CancelledIcon,
  LocalHospital as HospitalIcon,
  People as PeopleIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";

import { useAuth } from "../../context/useAuth";
import { getBloodRequestsByStatus } from "../../services/bloodRequestService";
import { getAllDonations } from "../../services/donationService";

import "./Dashboard.css";

interface StatCardProps {
  title: string;
  value: number;
  loading: boolean;
  icon: React.ReactNode;
  color: string;
  background: string;
  link?: string;
}

function StatCard({
  title,
  value,
  loading,
  icon,
  color,
  background,
  link,
}: StatCardProps) {
  return (
    <Card className="dashboard__stat-card">
      <CardContent>
        <Box className="dashboard__stat-header">
          <Typography color="text.secondary" sx={{ fontWeight: 600, fontSize: 14 }}>
            {title}
          </Typography>

          <Avatar
            sx={{
              bgcolor: background,
              color,
              width: 46,
              height: 46,
            }}
          >
            {icon}
          </Avatar>
        </Box>

        <Box className="dashboard__stat-value">
          {loading ? (
            <CircularProgress size={28} />
          ) : (
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              {value}
            </Typography>
          )}
        </Box>

        {link && (
          <Button
            component={Link}
            to={link}
            size="small"
            endIcon={<ArrowForwardIcon />}
            sx={{ mt: 1, px: 0 }}
          >
            Ver detalles
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const { user } = useAuth();

  const roles = user?.roles ?? [];

  const isAdmin = roles.includes("ADMIN");
  const isHemoAdmin = roles.includes("HEMOADMIN");

  const canManageDonations = isAdmin || isHemoAdmin;
  const canManageBloodCenters = isAdmin || isHemoAdmin;

  const [activeRequests, setActiveRequests] = useState(0);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [errorRequests, setErrorRequests] = useState("");

  const [registeredDonations, setRegisteredDonations] = useState(0);
  const [completedDonations, setCompletedDonations] = useState(0);
  const [cancelledDonations, setCancelledDonations] = useState(0);
  const [loadingDonations, setLoadingDonations] = useState(true);
  const [errorDonations, setErrorDonations] = useState("");

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
          setErrorRequests("No se pudieron cargar las solicitudes activas.");
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

  useEffect(() => {
    let active = true;

    async function fetchDonations() {
      try {
        const data = await getAllDonations();

        if (active) {
          setRegisteredDonations(
            data.filter((donation) => donation.status === "REGISTERED").length,
          );

          setCompletedDonations(
            data.filter((donation) => donation.status === "COMPLETED").length,
          );

          setCancelledDonations(
            data.filter((donation) => donation.status === "CANCELLED").length,
          );
        }
      } catch {
        if (active) {
          setErrorDonations("No se pudieron cargar las donaciones.");
        }
      } finally {
        if (active) {
          setLoadingDonations(false);
        }
      }
    }

    void fetchDonations();

    return () => {
      active = false;
    };
  }, []);

  return (
    <Box className="dashboard">
      {/* Encabezado */}
      <Box className="dashboard__heading">
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Inicio
        </Typography>

        <Typography color="text.secondary">
          Resumen general de Donar+
        </Typography>
      </Box>

      {/* Bienvenida */}
      <Card className="dashboard__welcome">
        <CardContent className="dashboard__welcome-content">
          <Box className="dashboard__welcome-info">
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              ¡Bienvenido, {user?.firstName}!
            </Typography>

            <Typography sx={{ opacity: 0.9, mt: 1 }}>
              Gracias por formar parte de Donar+.
              Juntos podemos ayudar a salvar vidas.
            </Typography>

            <Typography variant="body2" sx={{ opacity: 0.8, mt: 2 }}>
              {user?.email}
            </Typography>

            <Box className="dashboard__roles">
              {roles.length > 0 ? (
                roles.map((role) => (
                  <Chip
                    key={role}
                    label={role}
                    size="small"
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      color: "#FFFFFF",
                      fontWeight: 600,
                    }}
                  />
                ))
              ) : (
                <Typography variant="body2">
                  Sin roles asignados
                </Typography>
              )}
            </Box>
          </Box>

          <BloodtypeIcon className="dashboard__welcome-icon" />
        </CardContent>
      </Card>

      {/* Indicadores */}
      <Box className="dashboard__section">
        <Box className="dashboard__section-heading">
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Resumen general
          </Typography>

          <Typography color="text.secondary" variant="body2">
            Estado actual de solicitudes y donaciones
          </Typography>
        </Box>

        {errorRequests && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorRequests}
          </Alert>
        )}

        {errorDonations && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorDonations}
          </Alert>
        )}

        <Box className="dashboard__stats-grid">
          <StatCard
            title="Solicitudes activas"
            value={activeRequests}
            loading={loadingRequests}
            icon={<BloodtypeIcon />}
            color="#D71920"
            background="#FCE8E9"
            link="/requests"
          />

          <StatCard
            title="Donaciones registradas"
            value={registeredDonations}
            loading={loadingDonations}
            icon={<DonationIcon />}
            color="#2563A6"
            background="#E8F1FB"
          />

          <StatCard
            title="Donaciones completadas"
            value={completedDonations}
            loading={loadingDonations}
            icon={<CompletedIcon />}
            color="#198754"
            background="#E6F4EC"
          />

          <StatCard
            title="Donaciones canceladas"
            value={cancelledDonations}
            loading={loadingDonations}
            icon={<CancelledIcon />}
            color="#B7791F"
            background="#FFF4DB"
          />
        </Box>
      </Box>

      {/* Accesos rápidos */}
      <Box className="dashboard__section">
        <Box className="dashboard__section-heading">
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Accesos rápidos
          </Typography>

          <Typography color="text.secondary" variant="body2">
            Accedé rápidamente a las principales funcionalidades
          </Typography>
        </Box>

        <Box className="dashboard__quick-grid">
          <QuickAccessCard
            title="Solicitudes"
            description="Consultá las solicitudes de donación disponibles."
            icon={<BloodtypeIcon />}
            path="/requests"
          />

          <QuickAccessCard
            title="Mis donaciones"
            description="Consultá tus inscripciones y el estado de tus donaciones."
            icon={<DonationIcon />}
            path="/donations"
          />

          {canManageDonations && (
            <QuickAccessCard
              title="Gestión de donaciones"
              description="Administrá las donaciones y registrá las completadas."
              icon={<CompletedIcon />}
              path="/donation-management"
            />
          )}

          {canManageBloodCenters && (
            <QuickAccessCard
              title="Hemocentros"
              description="Gestioná la información de los hemocentros."
              icon={<HospitalIcon />}
              path="/blood-centers"
            />
          )}

          {isAdmin && (
            <QuickAccessCard
              title="Usuarios"
              description="Administrá los usuarios y sus roles."
              icon={<PeopleIcon />}
              path="/users"
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}

interface QuickAccessCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}

function QuickAccessCard({
  title,
  description,
  icon,
  path,
}: QuickAccessCardProps) {
  return (
    <Card className="dashboard__quick-card">
      <CardContent>
        <Avatar className="dashboard__quick-icon">
          {icon}
        </Avatar>

        <Typography
          variant="h6"
          sx={{
            mt: 2,
            fontWeight: 700,
          }}
        >
          {title}
        </Typography>

        <Typography
          color="text.secondary"
          variant="body2"
          sx={{ mt: 1, minHeight: 42 }}
        >
          {description}
        </Typography>

        <Button
          component={Link}
          to={path}
          endIcon={<ArrowForwardIcon />}
          sx={{ mt: 2, px: 0 }}
        >
          Acceder
        </Button>
      </CardContent>
    </Card>
  );
}

export default Dashboard;
