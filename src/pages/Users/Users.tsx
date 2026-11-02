
import { useEffect, useState } from "react";
import type { User } from "../../types/User";
import {
  getUsers,
  activateUser,
  deactivateUser,
} from "../../services/userService";

function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

 useEffect(() => {
  let active = true;

  async function fetchUsers() {
    try {
      const data = await getUsers();

      if (active) {
        setUsers(data);
      }
    } catch {
      if (active) {
        setError("No se pudo cargar el listado de usuarios.");
      }
    } finally {
      if (active) {
        setLoading(false);
      }
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

  if (loading) {
    return <p>Cargando usuarios...</p>;
  }

  return (
    <section>
      <h1>Gestión de usuarios</h1>

      <p>Administrá los usuarios registrados en Donar+.</p>

      {error && <p role="alert">{error}</p>}

      {users.length === 0 ? (
        <p>No hay usuarios registrados.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre y apellido</th>
                <th>Email</th>
                <th>Fecha de nacimiento</th>
                <th>Género</th>
                <th>Grupo sanguíneo</th>
                <th>Roles</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstName} {user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.birthDate}</td>
                  <td>{user.gender}</td>
                  <td>
                    {user.bloodTypeName} {user.rhFactorName}
                  </td>
                  <td>{user.roles.join(", ")}</td>
                  <td>
                    {user.status ? "Activo" : "Inactivo"}
                  </td>
                  <td>
                    <button
                      type="button"
                      disabled={updatingId === user.id}
                      onClick={() => void handleStatusChange(user)}
                    >
                      {updatingId === user.id
                        ? "Actualizando..."
                        : user.status
                          ? "Desactivar"
                          : "Activar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default Users;
