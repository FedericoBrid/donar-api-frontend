
import { useCallback, useEffect, useMemo, useState } from "react";

import "./DonationManagment.css";

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
  TextField,
  Typography,
} from "@mui/material";

import {
  CheckCircleOutlined,
  VolunteerActivism,
  Search,
  RestartAlt,
} from "@mui/icons-material";

import {
  completeDonation,
  getAllDonations,
  getDonationsByBloodRequest,
  type Donation,
} from "../../services/donationService";

function DonationManagement() {
  const [bloodRequestId, setBloodRequestId] = useState("");
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Carga de donaciones
  const loadDonations = useCallback(async (requestId?: string) => {
    setLoading(true);
    setError("");

    try {
      const data = requestId
        ? await getDonationsByBloodRequest(Number(requestId))
        : await getAllDonations();

      setDonations(data);
    } catch {
      setError("No se pudieron cargar las donaciones.");
      setDonations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carga inicial
  useEffect(() => {
    let active = true;

    async function fetchInitialDonations() {
      try {
        const data = await getAllDonations();

        if (active) {
          setDonations(data);
        }
      } catch {
        if (active) {
          setError("No se pudieron cargar las donaciones.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void fetchInitialDonations();

    return () => {
      active = false;
    };
  }, []);

  // Búsqueda por ID de solicitud
  async function searchDonations() {
    const id = bloodRequestId.trim();

    setMessage("");
    setError("");

    if (!id) {
      await loadDonations();
      return;
    }

    const numericId = Number(id);

    if (!Number.isInteger(numericId) || numericId <= 0) {
      setError("Ingresá un ID de solicitud válido.");
      return;
    }

    await loadDonations(id);
  }

  // Marcar una donación como completada
  const handleComplete = useCallback(
    async (donationId: number) => {
      const confirmed = window.confirm(
        "¿Confirmás que esta donación se realizó efectivamente?",
      );

      if (!confirmed) {
        return;
      }

      setCompletingId(donationId);
      setError("");
      setMessage("");

      try {
        await completeDonation(donationId);

        setMessage("La donación se marcó como completada.");

        await loadDonations(bloodRequestId.trim() || undefined);
      } catch {
        setError(
          "No se pudo completar la donación. Verificá su estado e intentá nuevamente.",
        );
      } finally {
        setCompletingId(null);
      }
    },
    [bloodRequestId, loadDonations],
  );

  // Definición de columnas
  const columns = useMemo<MRT_ColumnDef<Donation>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID de donación",
        size: 120,
      },
      {
        accessorKey: "userId",
        header: "ID de usuario",
      },
      {
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        id: "donorName",
        header: "Donante",
      },
      {
        accessorKey: "email",
        header: "Correo electrónico",
      },
      {
        accessorKey: "bloodRequestId",
        header: "ID de solicitud",
      },
      {
        accessorFn: (row) => getDonationStatusLabel(row.status),
        id: "status",
        header: "Estado",
        Cell: ({ row }) => (
          <Chip
            label={getDonationStatusLabel(row.original.status)}
            size="small"
            color={getDonationStatusColor(row.original.status)}
          />
        ),
      },
      {
        accessorFn: (row) => formatDateTime(row.registeredAt),
        id: "registeredAt",
        header: "Fecha de inscripción",
      },
      {
        accessorFn: (row) =>
          row.donatedAt ? formatDateTime(row.donatedAt) : "—",
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
          const isCompleting = completingId === donation.id;

          if (donation.status !== "REGISTERED") {
            return (
              <Typography variant="body2" color="text.secondary">
                Sin acciones
              </Typography>
            );
          }

          return (
            <Button
              variant="contained"
              color="success"
              size="small"
              startIcon={<CheckCircleOutlined />}
              disabled={isCompleting}
              onClick={() => void handleComplete(donation.id)}
            >
              {isCompleting ? "Procesando..." : "Marcar completada"}
            </Button>
          );
        },
      },
    ],
    [completingId, handleComplete],
  );

  // Configuración de la tabla
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
    <Box className="donation-management-page">
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
              Gestión de donaciones
            </Typography>
          </Box>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Consultá las inscripciones y gestioná el estado de las donaciones.
          </Typography>
        </Box>

        {/* Filtro por solicitud */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          <Box
            component="form"
            onSubmit={(event) => {
              event.preventDefault();
              void searchDonations();
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <TextField
              label="ID de solicitud"
              type="number"
              size="small"
              value={bloodRequestId}
              onChange={(event) => setBloodRequestId(event.target.value)}
              placeholder="Ingresá un ID"
              slotProps={{
                htmlInput: {
                  min: 1,
                },
              }}
              sx={{
                minWidth: 220,
                flex: 1,
              }}
            />

            <Button
              type="submit"
              variant="contained"
              color="error"
              startIcon={<Search />}
              disabled={loading}
            >
              Buscar
            </Button>

            <Button
              type="button"
              variant="outlined"
              color="inherit"
              startIcon={<RestartAlt />}
              disabled={loading}
              onClick={() => {
                setBloodRequestId("");
                setMessage("");
                setError("");
                void loadDonations();
              }}
            >
              Ver todas
            </Button>
          </Box>
        </Paper>

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

        {/* Tabla */}
        <Paper elevation={0} sx={{ borderRadius: 2 }}>
          <MaterialReactTable table={table} />
        </Paper>
      </Box>
    </Box>
  );
}

// Traducción de estados
function getDonationStatusLabel(status: Donation["status"]): string {
  const labels = {
    REGISTERED: "Registrada",
    COMPLETED: "Completada",
    CANCELLED: "Cancelada",
  };

  return labels[status];
}

// Colores de estados
function getDonationStatusColor(
  status: Donation["status"],
): "warning" | "success" | "error" {
  const colors = {
    REGISTERED: "warning",
    COMPLETED: "success",
    CANCELLED: "error",
  } as const;

  return colors[status];
}

// Formato de fecha y hora
function formatDateTime(value: string): string {
  const [date, time] = value.split("T");

  if (!date || !time) {
    return value;
  }

  const [year, month, day] = date.split("-");

  return `${day}/${month}/${year} ${time.slice(0, 5)}`;
}

export default DonationManagement;
