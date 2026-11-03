
import { useEffect, useMemo, useState } from "react";
import type { MRT_ColumnDef } from "material-react-table";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";

import "./BloodCenters.css";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  MenuItem,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  Add,
  BusinessOutlined,
  EditOutlined,
  CheckCircleOutlined,
  BlockOutlined,
  SaveOutlined,
  CloseOutlined,
  PublicOutlined,
  LocationOnOutlined,
} from "@mui/icons-material";

import {
  getBloodCenters,
  createBloodCenter,
  updateBloodCenter,
  activateBloodCenter,
  deactivateBloodCenter,
} from "../../services/bloodCenterService";

import type {
  BloodCenter,
  CreateBloodCenterRequest,
  UpdateBloodCenterRequest,
} from "../../types/BloodCenter";

import "./BloodCenters.css";

const EMPTY_FORM: CreateBloodCenterRequest = {
  name: "",
  address: "",
  phone: "",
  email: "",
  isPublic: true,
};

function BloodCenters() {
  const [centers, setCenters] = useState<BloodCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCenter, setEditingCenter] = useState<BloodCenter | null>(null);
  const [form, setForm] = useState<CreateBloodCenterRequest>(EMPTY_FORM);

  useEffect(() => {
    let active = true;

    async function loadCenters() {
      try {
        const data = await getBloodCenters();

        if (active) setCenters(data);
      } catch {
        if (active) {
          setError("No se pudieron cargar los hemocentros.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadCenters();

    return () => {
      active = false;
    };
  }, []);

  function handleCreate() {
    setEditingCenter(null);
    setForm(EMPTY_FORM);
    setError("");
    setSuccess("");
    setShowForm(true);
  }

  function handleEdit(center: BloodCenter) {
    setEditingCenter(center);
    setForm({
      name: center.name,
      address: center.address,
      phone: center.phone,
      email: center.email,
      isPublic: center.isPublic,
    });
    setError("");
    setSuccess("");
    setShowForm(true);
  }

  function handleCancel() {
    setShowForm(false);
    setEditingCenter(null);
    setForm(EMPTY_FORM);
    setError("");
  }

  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: name === "isPublic" ? value === "true" : value,
    }));
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (editingCenter) {
        const request: UpdateBloodCenterRequest = { ...form };
        const updated = await updateBloodCenter(editingCenter.id, request);

        setCenters((previous) =>
          previous.map((center) =>
            center.id === updated.id ? updated : center
          )
        );

        setSuccess("Hemocentro actualizado correctamente.");
      } else {
        const created = await createBloodCenter(form);

        setCenters((previous) => [...previous, created]);
        setSuccess("Hemocentro creado correctamente.");
      }

      setShowForm(false);
      setEditingCenter(null);
      setForm(EMPTY_FORM);
    } catch {
      setError(
        editingCenter
          ? "No se pudo actualizar el hemocentro. Revisá los datos."
          : "No se pudo crear el hemocentro. Revisá los datos."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(center: BloodCenter) {
    try {
      setUpdatingId(center.id);
      setError("");
      setSuccess("");

      const updated = center.status
        ? await deactivateBloodCenter(center.id)
        : await activateBloodCenter(center.id);

      setCenters((previous) =>
        previous.map((item) =>
          item.id === updated.id ? updated : item
        )
      );

      setSuccess(
        `Hemocentro ${updated.status ? "activado" : "desactivado"} correctamente.`
      );
    } catch {
      setError(
        `No se pudo ${center.status ? "desactivar" : "activar"} el hemocentro.`
      );
    } finally {
      setUpdatingId(null);
    }
  }

  const columns = useMemo<MRT_ColumnDef<BloodCenter>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 70,
      },
      {
        accessorKey: "name",
        header: "Nombre",
        size: 190,
      },
      {
        accessorKey: "address",
        header: "Dirección",
        size: 220,
        Cell: ({ cell }) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <LocationOnOutlined
              fontSize="small"
              color="action"
            />
            {cell.getValue<string>()}
          </Box>
        ),
      },
      {
        accessorKey: "phone",
        header: "Teléfono",
        size: 140,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 200,
      },
      {
        accessorKey: "isPublic",
        header: "Tipo",
        Cell: ({ cell }) => {
          const isPublic = Boolean(cell.getValue());

          return (
            <Chip
              label={isPublic ? "Público" : "Privado"}
              size="small"
              color={isPublic ? "info" : "default"}
              variant="outlined"
              icon={<PublicOutlined />}
            />
          );
        },
        size: 120,
      },
      {
        accessorKey: "status",
        header: "Estado",
        Cell: ({ cell }) => {
          const active = Boolean(cell.getValue());

          return (
            <Chip
              label={active ? "Activo" : "Inactivo"}
              size="small"
              color={active ? "success" : "default"}
              variant="outlined"
              icon={
                active ? (
                  <CheckCircleOutlined />
                ) : (
                  <BlockOutlined />
                )
              }
            />
          );
        },
        size: 110,
      },
      {
        id: "actions",
        header: "Acciones",
        enableColumnFilter: false,
        enableSorting: false,
        size: 130,
        Cell: ({ row }) => {
          const center = row.original;
          const updating = updatingId === center.id;

          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <Tooltip title="Editar hemocentro">
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  onClick={() => handleEdit(center)}
                >
                  <EditOutlined fontSize="small" />
                </Button>
              </Tooltip>

              <Tooltip
                title={
                  center.status
                    ? "Desactivar hemocentro"
                    : "Activar hemocentro"
                }
              >
                <span>
                  <Button
                    size="small"
                    variant="outlined"
                    color={center.status ? "error" : "success"}
                    disabled={updating}
                    onClick={() => void handleStatusChange(center)}
                  >
                    {updating ? (
                      <CircularProgress size={18} />
                    ) : center.status ? (
                      <BlockOutlined fontSize="small" />
                    ) : (
                      <CheckCircleOutlined fontSize="small" />
                    )}
                  </Button>
                </span>
              </Tooltip>
            </Box>
          );
        },
      },
    ],
    [updatingId]
  );

  const table = useMaterialReactTable({
    columns,
    data: centers,
    localization: MRT_Localization_ES,
    enableColumnFilters: true,
    enableGlobalFilter: true,
    enableSorting: true,
    enablePagination: true,
    initialState: {
      density: "comfortable",
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: 3,
        overflow: "hidden",
      },
    },
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: "grey.50",
        fontWeight: 700,
      },
    },
    muiTableBodyRowProps: {
      sx: {
        "&:hover": {
          backgroundColor: "action.hover",
        },
      },
    },
  });

  if (loading) {
    return (
      <Box className="blood-centers-page blood-centers-loading">
        <CircularProgress color="error" />
        <Typography color="text.secondary">
          Cargando hemocentros...
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="blood-centers-page">
      <Box className="blood-centers-header">
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <BusinessOutlined color="error" fontSize="large" />

            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Gestión de hemocentros
            </Typography>
          </Box>

          <Typography color="text.secondary">
            Administrá los hemocentros registrados en Donar+.
          </Typography>
        </Box>

        {!showForm && (
          <Button
            variant="contained"
            color="error"
            startIcon={<Add />}
            onClick={handleCreate}
          >
            Crear hemocentro
          </Button>
        )}
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2, borderRadius: 2 }}
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          sx={{ mb: 2, borderRadius: 2 }}
          onClose={() => setSuccess("")}
        >
          {success}
        </Alert>
      )}

      {showForm ? (
        <Paper
          elevation={0}
          className="blood-center-form-paper"
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <BusinessOutlined color="error" fontSize="large" />

            <Box>
              <Typography sx={{ variant: "h5", fontWeight: 700 }}>
                {editingCenter ? "Editar hemocentro" : "Nuevo hemocentro"}
              </Typography>

              <Typography sx={{ variant: "body2", color: "text.secondary" }}>
                Completá los datos del establecimiento.
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box
            component="form"
            onSubmit={handleSave}
            className="blood-center-form-grid"
          >
            <TextField
              label="Nombre"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              required
              fullWidth
              disabled={saving}
            />

            <TextField
              label="Dirección"
              name="address"
              value={form.address}
              onChange={handleInputChange}
              required
              fullWidth
              disabled={saving}
            />

            <TextField
              label="Teléfono"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleInputChange}
              required
              fullWidth
              disabled={saving}
            />

            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleInputChange}
              required
              fullWidth
              disabled={saving}
            />

            <TextField
              select
              label="Tipo de hemocentro"
              name="isPublic"
              value={String(form.isPublic)}
              onChange={handleInputChange}
              required
              fullWidth
              disabled={saving}
            >
              <MenuItem value="true">Público</MenuItem>
              <MenuItem value="false">Privado</MenuItem>
            </TextField>

            <Box
              className="blood-center-form-actions"
              sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5 }}
            >
              <Button
                type="button"
                variant="outlined"
                color="inherit"
                startIcon={<CloseOutlined />}
                onClick={handleCancel}
                disabled={saving}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                variant="contained"
                color="error"
                startIcon={
                  saving ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <SaveOutlined />
                  )
                }
                disabled={saving}
              >
                {saving
                  ? "Guardando..."
                  : editingCenter
                    ? "Guardar cambios"
                    : "Crear hemocentro"}
              </Button>
            </Box>
          </Box>
        </Paper>
      ) : (
        <Paper
          elevation={0}
          className="blood-centers-table-paper"
        >
          {centers.length === 0 ? (
            <Box className="blood-centers-empty">
              <BusinessOutlined
                sx={{ fontSize: 52, color: "text.disabled" }}
              />

              <Typography sx={{ variant: "h6", fontWeight: 600 }}>
                No hay hemocentros registrados
              </Typography>

              <Typography color="text.secondary">
                Cuando registres un hemocentro, aparecerá en este listado.
              </Typography>
            </Box>
          ) : (
            <MaterialReactTable table={table} />
          )}
        </Paper>
      )}
    </Box>
  );
}

export default BloodCenters;
