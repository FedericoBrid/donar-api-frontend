
import { useState } from "react";
import type { FormEvent } from "react";
import type { User } from "../../../types/User";
import type {
  CreateUserRequest,
  UpdateUserRequest,
} from "../../../services/userService";
import {
  BLOOD_TYPES,
  RH_FACTORS,
  GENDERS,
} from "../../../constants/catalogs";

interface UserFormProps {
  user: User | null;
  onSave: (
    data: CreateUserRequest | UpdateUserRequest
  ) => Promise<void>;
  onCancel: () => void;
}

function UserForm({ user, onSave, onCancel }: UserFormProps) {
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [birthDate, setBirthDate] = useState(user?.birthDate ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState(user?.gender ?? "");
  const [bloodTypeId, setBloodTypeId] = useState(
    user?.bloodTypeId.toString() ?? ""
  );
  const [rhFactorId, setRhFactorId] = useState(
    user?.rhFactorId.toString() ?? ""
  );
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    try {
      if (user) {
        const data: UpdateUserRequest = {
          firstName,
          lastName,
          birthDate,
          gender,
          bloodTypeId: Number(bloodTypeId),
          rhFactorId: Number(rhFactorId),
        };

        await onSave(data);
      } else {
        const data: CreateUserRequest = {
          firstName,
          lastName,
          birthDate,
          email,
          password,
          gender,
          bloodTypeId: Number(bloodTypeId),
          rhFactorId: Number(rhFactorId),
        };

        await onSave(data);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>{user ? "Editar usuario" : "Crear usuario"}</h2>

      <div>
        <label htmlFor="firstName">Nombre</label>
        <input
          id="firstName"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="lastName">Apellido</label>
        <input
          id="lastName"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="birthDate">Fecha de nacimiento</label>
        <input
          id="birthDate"
          type="date"
          value={birthDate}
          max={new Date().toISOString().split("T")[0]}
          onChange={(e) => setBirthDate(e.target.value)}
          required
        />
      </div>

      {!user && (
        <>
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>
        </>
      )}

      <div>
        <label htmlFor="gender">Género</label>
        <select
          id="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        >
          <option value="">Seleccionar género</option>
          {GENDERS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="bloodTypeId">Grupo sanguíneo</label>
        <select
          id="bloodTypeId"
          value={bloodTypeId}
          onChange={(e) => setBloodTypeId(e.target.value)}
          required
        >
          <option value="">Seleccionar grupo</option>
          {BLOOD_TYPES.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="rhFactorId">Factor Rh</label>
        <select
          id="rhFactorId"
          value={rhFactorId}
          onChange={(e) => setRhFactorId(e.target.value)}
          required
        >
          <option value="">Seleccionar factor Rh</option>
          {RH_FACTORS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" disabled={saving}>
        {saving
          ? "Guardando..."
          : user
            ? "Guardar cambios"
            : "Crear usuario"}
      </button>

      <button type="button" onClick={onCancel} disabled={saving}>
        Cancelar
      </button>
    </form>
  );
}

export default UserForm;
