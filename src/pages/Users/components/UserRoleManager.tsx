
import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import {
  AdminPanelSettingsOutlined,
  CheckCircleOutlined,
  CloseOutlined,
  PersonOutlined,
  SecurityOutlined,
  ToggleOffOutlined,
  ToggleOnOutlined,
} from "@mui/icons-material";

import {
  getUserRoles,
  assignRole,
  deactivateRole,
} from "../../../services/userService";

import type { UserRole } from "../../../services/userService";

interface UserRoleManagerProps {
  userId: number;
  userName: string;
  onClose: () => void;
  onRolesUpdated: () => void;
}

const AVAILABLE_ROLES = [
  { id: 1, name: "ADMIN", description: "Administración completa" },
  { id: 2, name: "HEMOADMIN", description: "Gestión de hemocentros y solicitudes" },
  { id: 3, name: "USER", description: "Acceso de usuario" },
];

export default function UserRoleManager({
  userId,
  userName,
  onClose,
  onRolesUpdated,
}: UserRoleManagerProps) {
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingRoleId, setUpdatingRoleId] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    async function loadRoles() {
      try {
        setLoading(true);
        setError("");

        const data = await getUserRoles(userId);

        if (active) {
          setRoles(data);
        }
      } catch {
        if (active) {
          setError("No se pudieron cargar los roles del usuario.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadRoles();

    return () => {
      active = false;
    };
  }, [userId]);

  async function handleRoleChange(roleId: number) {
    const existingRole = roles.find((role) => role.roleId === roleId);

    try {
      setUpdatingRoleId(roleId);
      setError("");

      if (existingRole?.status) {
        await deactivateRole(userId, roleId);
      } else {
        // Asigna el rol si no existe o lo reactiva si estaba inactivo.
        await assignRole(userId, roleId);
      }

      const updatedRoles = await getUserRoles(userId);
      setRoles(updatedRoles);

      onRolesUpdated();
    } catch {
      setError("No se pudo actualizar el rol. Intentá nuevamente.");
    } finally {
      setUpdatingRoleId(null);
    }
  }

  function getRoleStatus(roleId: number) {
    const role = roles.find((item) => item.roleId === roleId);

    if (!role) return "No asignado";

    return role.status ? "Activo" : "Inactivo";
  }

  function getActionLabel(roleId: number) {
    const role = roles.find((item) => item.roleId === roleId);

    if (!role) return "Asignar";

    return role.status ? "Desactivar" : "Reactivar";
  }

  function getRoleIcon(roleName: string) {
    switch (roleName) {
      case "ADMIN":
        return <AdminPanelSettingsOutlined />;
      case "HEMOADMIN":
        return <SecurityOutlined />;
      default:
        return <PersonOutlined />;
    }
  }

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 3,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          p: 2.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <SecurityOutlined color="error" fontSize="large" />

          <Box>
            <Typography sx={{ variant: "h6", fontWeight: 700 }}>
              Gestión de roles
            </Typography>

            <Typography sx={{ variant: "body2", color: "text.secondary" }}>
              {userName}
            </Typography>
          </Box>
        </Box>

        <Button
          variant="outlined"
          color="inherit"
          size="small"
          startIcon={<CloseOutlined />}
          onClick={onClose}
        >
          Cerrar
        </Button>
      </Box>

      <Divider />

      <Box sx={{ p: 2.5 }}>
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2, borderRadius: 2 }}
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              py: 4,
            }}
          >
            <CircularProgress size={24} color="error" />
            <Typography color="text.secondary">
              Cargando roles...
            </Typography>
          </Box>
        ) : (
          <>
            <Typography
              color="text.secondary"
              variant="body2"
              sx={{ mb: 2 }}
            >
              Un usuario puede tener varios roles activos simultáneamente.
              Administrá los permisos asignados desde esta sección.
            </Typography>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Rol</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell align="right">Acción</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {AVAILABLE_ROLES.map((availableRole) => {
                    const status = getRoleStatus(availableRole.id);
                    const isActive = status === "Activo";
                    const isUpdating =
                      updatingRoleId === availableRole.id;

                    return (
                      <TableRow key={availableRole.id} hover>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            {getRoleIcon(availableRole.name)}

                            <Typography sx={{ fontWeight: 600 }}>
                              {availableRole.name}
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {availableRole.description}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={status}
                            size="small"
                            color={
                              isActive
                                ? "success"
                                : status === "Inactivo"
                                  ? "default"
                                  : "warning"
                            }
                            variant="outlined"
                            icon={
                              isActive ? <CheckCircleOutlined /> : undefined
                            }
                          />
                        </TableCell>

                        <TableCell align="right">
                          <Button
                            size="small"
                            variant="outlined"
                            color={isActive ? "error" : "primary"}
                            disabled={updatingRoleId !== null}
                            startIcon={
                              isUpdating ? (
                                <CircularProgress size={16} />
                              ) : isActive ? (
                                <ToggleOffOutlined />
                              ) : (
                                <ToggleOnOutlined />
                              )
                            }
                            onClick={() =>
                              void handleRoleChange(availableRole.id)
                            }
                          >
                            {isUpdating
                              ? "Procesando..."
                              : getActionLabel(availableRole.id)}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>
    </Paper>
  );
}
