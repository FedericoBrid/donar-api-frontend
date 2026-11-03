
import { useEffect, useMemo, useState } from "react";
import type { MRT_ColumnDef } from "material-react-table";

import "./Users.css";

import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  Add,
  BlockOutlined,
  CheckCircleOutlined,
  EditOutlined,
  ManageAccountsOutlined,
  PeopleAltOutlined,
} from "@mui/icons-material";

import type { User } from "../../types/User";

import {
  getUsers,
  activateUser,
  deactivateUser,
  createUser,
  updateUser,
} from "../../services/userService";

import type {
  CreateUserRequest,
  UpdateUserRequest,
} from "../../services/userService";

import UserForm from "./components/UserForm.tsx";
import UserRoleManager from "./components/UserRoleManager.tsx";

import "./Users.css";

function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUserForRoles, setSelectedUserForRoles] =
    useState<User | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchUsers() {
      try {
        const data = await getUsers();

        if (active) setUsers(data);
      } catch {
        if (active) {
          setError("No se pudo cargar el listado de usuarios.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void fetchUsers();

    return () => {
      active = false;
    };
  }, []);

  async function handleStatusChange(user: User) {
    try {
      setUpdatingId(user.id);
      setError("");

      const updatedUser = user.status
        ? await deactivateUser(user.id)
        : await activateUser(user.id);

      setUsers((previous) =>
        previous.map((item) =>
          item.id === user.id ? updatedUser : item
        )
      );
    } catch {
      setError(
        `No se pudo ${user.status ? "desactivar" : "activar"} al usuario.`
      );
    } finally {
      setUpdatingId(null);
    }
  }

  function handleCreate() {
    setEditingUser(null);
    setSelectedUserForRoles(null);
    setShowForm(true);
    setError("");
  }

  function handleEdit(user: User) {
    setEditingUser(user);
    setSelectedUserForRoles(null);
    setShowForm(true);
    setError("");
  }

  async function handleSave(
    data: CreateUserRequest | UpdateUserRequest
  ) {
    try {
      setError("");

      if (editingUser) {
        const updatedUser = await updateUser(
          editingUser.id,
          data as UpdateUserRequest
        );

        setUsers((previous) =>
          previous.map((item) =>
            item.id === editingUser.id ? updatedUser : item
          )
        );
      } else {
        const newUser = await createUser(data as CreateUserRequest);
        setUsers((previous) => [...previous, newUser]);
      }

      setShowForm(false);
      setEditingUser(null);
    } catch {
      setError(
        editingUser
          ? "No se pudo actualizar el usuario."
          : "No se pudo crear el usuario."
      );

      throw new Error("No se pudo guardar el usuario.");
    }
  }

  async function handleRolesUpdated() {
    try {
      const updatedUsers = await getUsers();
      setUsers(updatedUsers);
    } catch {
      setError(
        "Los roles se actualizaron, pero no se pudo refrescar el listado."
      );
    }
  }

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 70,
      },
      {
        id: "fullName",
        header: "Nombre y apellido",
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        size: 190,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 220,
      },
      {
        accessorKey: "birthDate",
        header: "Fecha de nacimiento",
        size: 150,
      },
      {
        accessorKey: "gender",
        header: "Género",
        size: 110,
      },
      {
        id: "bloodGroup",
        header: "Grupo sanguíneo",
        accessorFn: (row) =>
          `${row.bloodTypeName} ${row.rhFactorName}`,
        size: 140,
      },
      {
        id: "roles",
        header: "Roles",
        accessorFn: (row) => row.roles.join(", "),
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
            {row.original.roles.map((role) => (
              <Chip
                key={role}
                label={role}
                size="small"
                variant="outlined"
                color="default"
              />
            ))}
          </Box>
        ),
        size: 180,
      },
      {
        accessorKey: "status",
        header: "Estado",
        Cell: ({ cell }) => {
          const active = Boolean(cell.getValue());

          return (
            <Chip
              label={active ? "Activo" : "Inactivo"}
              color={active ? "success" : "default"}
              size="small"
              icon={
                active ? (
                  <CheckCircleOutlined />
                ) : (
                  <BlockOutlined />
                )
              }
              variant="outlined"
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
        size: 190,
        Cell: ({ row }) => {
          const user = row.original;
          const updating = updatingId === user.id;

          return (
            <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
              <Tooltip title="Editar usuario">
                <span>
                  <Button
                    size="small"
                    color="primary"
                    variant="outlined"
                    onClick={() => handleEdit(user)}
                  >
                    <EditOutlined fontSize="small" />
                  </Button>
                </span>
              </Tooltip>

              <Tooltip title={user.status ? "Desactivar usuario" : "Activar usuario"}>
                <span>
                  <Button
                    size="small"
                    color={user.status ? "error" : "success"}
                    variant="outlined"
                    disabled={updating}
                    onClick={() => void handleStatusChange(user)}
                  >
                    {updating ? (
                      <CircularProgress size={18} />
                    ) : user.status ? (
                      <BlockOutlined fontSize="small" />
                    ) : (
                      <CheckCircleOutlined fontSize="small" />
                    )}
                  </Button>
                </span>
              </Tooltip>

              <Tooltip title="Gestionar roles">
                <Button
                  size="small"
                  color="secondary"
                  variant="outlined"
                  onClick={() => {
                    setSelectedUserForRoles(user);
                    setError("");
                  }}
                >
                  <ManageAccountsOutlined fontSize="small" />
                </Button>
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
    data: users,
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
        border: "1px solid",
        borderColor: "divider",
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
    localization: MRT_Localization_ES,
  });

  if (loading) {
    return (
      <Box className="users-page users-loading">
        <CircularProgress color="error" />
        <Typography color="text.secondary">
          Cargando usuarios...
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="users-page">
      <Box className="users-header">
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <PeopleAltOutlined color="error" fontSize="large" />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Gestión de usuarios
            </Typography>
          </Box>

          <Typography color="text.secondary">
            Administrá los usuarios registrados en Donar+.
          </Typography>
        </Box>

        {!showForm && (
          <Button
            variant="contained"
            color="error"
            startIcon={<Add />}
            onClick={handleCreate}
          >
            Crear usuario
          </Button>
        )}
      </Box>

      {error && (
        <Alert
          severity="error"
          onClose={() => setError("")}
          sx={{ mb: 3, borderRadius: 2 }}
        >
          {error}
        </Alert>
      )}

      {showForm ? (
        <Paper className="users-form-paper" elevation={0}>
          <UserForm
            key={editingUser?.id ?? "new"}
            user={editingUser}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingUser(null);
              setError("");
            }}
          />
        </Paper>
      ) : (
        <>
          <Paper className="users-table-paper" elevation={0}>
            {users.length === 0 ? (
              <Box className="users-empty">
                <PeopleAltOutlined
                  sx={{ fontSize: 52, color: "text.disabled" }}
                />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  No hay usuarios registrados
                </Typography>
                <Typography color="text.secondary">
                  Cuando se registren usuarios, aparecerán en este listado.
                </Typography>
              </Box>
            ) : (
              <MaterialReactTable table={table} />
            )}
          </Paper>

          {selectedUserForRoles && (
            <UserRoleManager
              userId={selectedUserForRoles.id}
              userName={`${selectedUserForRoles.firstName} ${selectedUserForRoles.lastName}`}
              onClose={() => setSelectedUserForRoles(null)}
              onRolesUpdated={handleRolesUpdated}
            />
          )}
        </>
      )}
    </Box>
  );
}

export default Users;
