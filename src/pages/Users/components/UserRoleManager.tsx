
import { useEffect, useState } from "react";
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
  { id: 1, name: "ADMIN" },
  { id: 2, name: "HEMOADMIN" },
  { id: 3, name: "USER" },
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

  return (
    <section className="card mt-4">
      <div className="card-header d-flex justify-content-between align-items-center">
        <div>
          <h5 className="mb-0">Gestión de roles</h5>
          <small className="text-muted">{userName}</small>
        </div>

        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>

      <div className="card-body">
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {loading ? (
          <p>Cargando roles...</p>
        ) : (
          <>
            <p className="text-muted">
              Un usuario puede tener varios roles activos simultáneamente.
            </p>

            <div className="table-responsive">
              <table className="table table-striped align-middle">
                <thead>
                  <tr>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>

                <tbody>
                  {AVAILABLE_ROLES.map((availableRole) => {
                    const status = getRoleStatus(availableRole.id);
                    const isActive = status === "Activo";
                    const isUpdating =
                      updatingRoleId === availableRole.id;

                    return (
                      <tr key={availableRole.id}>
                        <td>{availableRole.name}</td>

                        <td>
                          <span
                            className={`badge ${
                              isActive
                                ? "bg-success"
                                : status === "Inactivo"
                                  ? "bg-secondary"
                                  : "bg-light text-dark"
                            }`}
                          >
                            {status}
                          </span>
                        </td>

                        <td>
                          <button
                            type="button"
                            className={`btn btn-sm ${
                              isActive
                                ? "btn-outline-danger"
                                : "btn-outline-primary"
                            }`}
                            disabled={updatingRoleId !== null}
                            onClick={() =>
                              handleRoleChange(availableRole.id)
                            }
                          >
                            {isUpdating
                              ? "Procesando..."
                              : getActionLabel(availableRole.id)}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
