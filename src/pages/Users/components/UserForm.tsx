
import { useState } from "react";
import type { FormEvent } from "react";

import "../Users.css";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import {
  PersonAddOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@mui/icons-material";

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
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

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
    } catch {
      setError(
        user
          ? "No se pudieron guardar los cambios del usuario."
          : "No se pudo crear el usuario. Verificá los datos ingresados."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Paper elevation={0} className="user-form-card">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          mb: 2,
        }}
      >
        <PersonAddOutlined color="error" fontSize="large" />

        <Box>
          <Typography sx={{ variant: "h5", fontWeight: 700 }}>
            {user ? "Editar usuario" : "Crear usuario"}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {user
              ? "Modificá los datos personales del usuario."
              : "Completá los datos para registrar un nuevo usuario."}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate={false}
      >
        <Box className="user-form-grid">
          <TextField
            label="Nombre"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            fullWidth
            disabled={saving}
          />

          <TextField
            label="Apellido"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            fullWidth
            disabled={saving}
          />

          <TextField
            label="Fecha de nacimiento"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            required
            fullWidth
            disabled={saving}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
              htmlInput: {
                max: new Date().toISOString().split("T")[0],
              },
            }}
          />

          {!user && (
            <>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                disabled={saving}
              />

              <TextField
                label="Contraseña"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                disabled={saving}
                slotProps={{
                  htmlInput: {
                    minLength: 8,
                  },
                }}
                helperText="Mínimo 8 caracteres."
              />
            </>
          )}

          <TextField
            select
            label="Género"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
            fullWidth
            disabled={saving}
          >
            {GENDERS.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Grupo sanguíneo"
            value={bloodTypeId}
            onChange={(e) => setBloodTypeId(e.target.value)}
            required
            fullWidth
            disabled={saving}
          >
            {BLOOD_TYPES.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Factor Rh"
            value={rhFactorId}
            onChange={(e) => setRhFactorId(e.target.value)}
            required
            fullWidth
            disabled={saving}
          >
            {RH_FACTORS.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 1.5,
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<CloseOutlined />}
            onClick={onCancel}
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
              : user
                ? "Guardar cambios"
                : "Crear usuario"}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

export default UserForm;
