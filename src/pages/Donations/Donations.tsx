
import { useCallback, useEffect, useMemo, useState } from "react";

import "./Donations.css";

import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";

import {
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Typography,
} from "@mui/material";

import {
  CancelOutlined,
  VolunteerActivism,
} from "@mui/icons-material";

import {
  cancelDonation,
  getMyDonations,
  type MyDonation,
} from "../../services/donationService";

import {
  formatDate,
  getUrgencyLabel,
} from "../../utils/bloodRequestUtils";

function Donations() {
  const [donations, setDonations] = useState<MyDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  // Carga inicial de las donaciones
  useEffect(() => {
    let active = true;

    async function fetchDonations() {
      try {
        const data = await getMyDonations();

        if (active) {
          setDonations(data);
        }
      } catch {
        if (active) {
          setError("No se pudieron cargar tus donaciones.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void fetchDonations();

    return () => {
      active = false;
    };
  }, []);

  // Cancelación de una inscripción
  const handleCancel = useCallback(async (donationId: number) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que querés cancelar esta inscripción?",
    );

    if (!confirmed) {
      return;
    }

    setCancellingId(donationId);
    setMessage("");
    setError("");

    try {
      await cancelDonation(donationId);

      setMessage("La inscripción se canceló correctamente.");

      const data = await getMyDonations();
      setDonations(data);
    } catch {
      setError("No se pudo cancelar la inscripción.");
    } finally {
      setCancellingId(null);
    }
  }, []);

  // Definición de las columnas
  const columns = useMemo<MRT_ColumnDef<MyDonation>[]>(
    () => [
      {
        accessorKey: "donationId",
        header: "ID",
        size: 70,
      },
      {
        accessorFn: (row) =>
          `${row.bloodTypeName} ${row.rhFactorName}`,
        id: "bloodType",
        header: "Grupo sanguíneo",
      },
      {
        accessorKey: "bloodCenterName",
        header: "Hemocentro",
      },
      {
        accessorFn: (row) => getUrgencyLabel(row.urgency),
        id: "urgency",
        header: "Urgencia",
      },
      {
        accessorFn: (row) => getRequestStatusLabel(row.requestStatus),
        id: "requestStatus",
        header: "Estado de solicitud",
        Cell: ({ row }) => (
          <Chip
            label={getRequestStatusLabel(row.original.requestStatus)}
            size="small"
            color={getRequestStatusColor(row.original.requestStatus)}
            variant="outlined"
          />
        ),
      },
      {
        accessorFn: (row) => getDonationStatusLabel(row.donationStatus),
        id: "donationStatus",
        header: "Estado de donación",
        Cell: ({ row }) => (
          <Chip
            label={getDonationStatusLabel(row.original.donationStatus)}
            size="small"
            color={getDonationStatusColor(row.original.donationStatus)}
          />
        ),
      },
      {
        accessorFn: (row) =>
          formatDate(row.registeredAt.split("T")[0]),
        id: "registeredAt",
        header: "Fecha de inscripción",
      },
      {
        accessorFn: (row) =>
          row.donatedAt
            ? formatDate(row.donatedAt.split("T")[0])
            : "—",
        id: "donatedAt",
        header: "Fecha de donación",
      },
      {
        id: "actions",
        header: "Acciones",
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }) => {
          const donation = row.original;
          const isCancelling = cancellingId === donation.donationId;

          if (donation.donationStatus !== "REGISTERED") {
            return (
              <Typography variant="body2" color="text.secondary">
                Sin acciones
              </Typography>
            );
          }

          return (
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<CancelOutlined />}
              disabled={isCancelling}
              onClick={() => void handleCancel(donation.donationId)}
            >
              {isCancelling ? "Cancelando..." : "Cancelar"}
            </Button>
          );
        },
      },
    ],
    [cancellingId, handleCancel],
  );

  const table = useMaterialReactTable({
    columns,
    data: donations,
    state: {
      isLoading: loading,
    },
    enableGlobalFilter: true,
    enableColumnFilters: true,
    enableSorting: true,
    enablePagination: true,
    initialState: {
      showGlobalFilter: true,
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
    localization: {
      noRecordsToDisplay: "No hay donaciones para mostrar",
      noResultsFound: "No se encontraron resultados",
      search: "Buscar",
      rowsPerPage: "Filas por página",
      of: "de",
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
      },
    },
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: "#F7F8FA",
        color: "#263238",
        fontWeight: 700,
      },
    },
    muiTableBodyRowProps: {
      sx: {
        "&:hover": {
          backgroundColor: "#FFF5F5",
        },
      },
    },
    muiSearchTextFieldProps: {
      placeholder: "Buscar donación...",
      size: "small",
      variant: "outlined",
    },
  });

  return (
    <Box className="donations-page">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* Encabezado */}
        <Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <VolunteerActivism
              sx={{ color: "#D71920", fontSize: 32 }}
            />

            <Typography
              variant="h4"
              sx={{ fontWeight: 700 }}
              color="#263238"
            >
              Mis donaciones
            </Typography>
          </Box>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Consultá tus inscripciones y el estado de tus donaciones.
          </Typography>
        </Box>

        {/* Mensajes */}
        {error && (
          <Alert severity="error" onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {message && (
          <Alert severity="success" onClose={() => setMessage("")}>
            {message}
          </Alert>
        )}

        {/* Contenido */}
        {!loading && donations.length === 0 && !error ? (
          <Paper
            elevation={0}
            sx={{
              p: 5,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              textAlign: "center",
            }}
          >
            <VolunteerActivism
              sx={{
                fontSize: 52,
                color: "#D71920",
                mb: 1,
              }}
            />

            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Todavía no tenés donaciones registradas
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Cuando te inscribas para donar, vas a poder consultar
              acá el estado y los detalles de tus donaciones.
            </Typography>
          </Paper>
        ) : (
          <Paper elevation={0} sx={{ borderRadius: 2 }}>
            <MaterialReactTable table={table} />
          </Paper>
        )}
      </Box>
    </Box>
  );
}

// Traducción de estados de solicitud
function getRequestStatusLabel(
  status: MyDonation["requestStatus"],
): string {
  const labels = {
    ACTIVE: "Activa",
    FULFILLED: "Completada",
    EXPIRED: "Vencida",
    CANCELLED: "Cancelada",
  };

  return labels[status];
}

// Colores de estados de solicitud
function getRequestStatusColor(
  status: MyDonation["requestStatus"],
): "success" | "info" | "warning" | "error" {
  const colors = {
    ACTIVE: "success",
    FULFILLED: "info",
    EXPIRED: "warning",
    CANCELLED: "error",
  } as const;

  return colors[status];
}

// Traducción de estados de donación
function getDonationStatusLabel(
  status: MyDonation["donationStatus"],
): string {
  const labels = {
    REGISTERED: "Registrada",
    COMPLETED: "Completada",
    CANCELLED: "Cancelada",
  };

  return labels[status];
}

// Colores de estados de donación
function getDonationStatusColor(
  status: MyDonation["donationStatus"],
): "warning" | "success" | "error" {
  const colors = {
    REGISTERED: "warning",
    COMPLETED: "success",
    CANCELLED: "error",
  } as const;

  return colors[status];
}

export default Donations;
