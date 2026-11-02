
import { useEffect, useState } from "react";
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
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
        previous.map((item) => (item.id === updated.id ? updated : item))
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

  if (loading) {
    return <p>Cargando hemocentros...</p>;
  }

  return (
    <section>
      <h1>Gestión de hemocentros</h1>
      <p>Administrá los hemocentros registrados en Donar+.</p>

      {error && <p role="alert">{error}</p>}
      {success && <p role="status">{success}</p>}

      {!showForm ? (
        <button type="button" onClick={handleCreate}>
          Crear hemocentro
        </button>
      ) : (
        <form onSubmit={handleSave}>
          <h2>
            {editingCenter ? "Editar hemocentro" : "Nuevo hemocentro"}
          </h2>

          <div>
            <label htmlFor="name">Nombre</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label htmlFor="address">Dirección</label>
            <input
              id="address"
              name="address"
              value={form.address}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label htmlFor="phone">Teléfono</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label htmlFor="isPublic">Tipo de hemocentro</label>
            <select
              id="isPublic"
              name="isPublic"
              value={String(form.isPublic)}
              onChange={handleInputChange}
              required
            >
              <option value="true">Público</option>
              <option value="false">Privado</option>
            </select>
          </div>

          <button type="submit" disabled={saving}>
            {saving
              ? "Guardando..."
              : editingCenter
                ? "Guardar cambios"
                : "Crear"}
          </button>

          <button type="button" onClick={handleCancel} disabled={saving}>
            Cancelar
          </button>
        </form>
      )}

      {!showForm && (
        centers.length === 0 ? (
          <p>No hay hemocentros registrados.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Dirección</th>
                  <th>Teléfono</th>
                  <th>Email</th>
                  <th>Tipo</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {centers.map((center) => (
                  <tr key={center.id}>
                    <td>{center.id}</td>
                    <td>{center.name}</td>
                    <td>{center.address}</td>
                    <td>{center.phone}</td>
                    <td>{center.email}</td>
                    <td>{center.isPublic ? "Público" : "Privado"}</td>
                    <td>{center.status ? "Activo" : "Inactivo"}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleEdit(center)}
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        disabled={updatingId === center.id}
                        onClick={() => void handleStatusChange(center)}
                      >
                        {updatingId === center.id
                          ? "Actualizando..."
                          : center.status
                            ? "Desactivar"
                            : "Activar"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </section>
  );
}

export default BloodCenters;
