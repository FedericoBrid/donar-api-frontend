import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import {
  ArrowBack,
  VolunteerActivismOutlined,
} from "@mui/icons-material";

import { createUser } from "../../services/userService";
import {
  BLOOD_TYPES,
  RH_FACTORS,
  GENDERS,
} from "../../constants/catalogs";

import type { CreateUserRequest } from "../../services/userService";

import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    bloodTypeId: "",
    rhFactorId: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (form.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const request: CreateUserRequest = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        birthDate: form.birthDate,
        email: form.email.trim(),
        password: form.password,
        gender: form.gender,
        bloodTypeId: Number(form.bloodTypeId),
        rhFactorId: Number(form.rhFactorId),
      };

      await createUser(request);

      setSuccess("¡Tu cuenta fue creada correctamente!");

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);

    } catch {
      setError(
        "No pudimos crear tu cuenta. Verificá los datos e intentá nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toLocaleDateString("en-CA");

  return (
    <Box className="register-page">
      <Paper className="register-card" elevation={0}>

        {/* ENCABEZADO */}
        <Box className="register-header">
          <Link to="/" className="register-back">
            <ArrowBack fontSize="small" />
            Volver al inicio
          </Link>

          <Box className="register-brand">
            <Box className="register-logo">
              <VolunteerActivismOutlined />
            </Box>

            <Typography variant="h4" component="h1">
              Donar<span>+</span>
            </Typography>

            <Typography color="text.secondary">
              Formá parte de nuestra comunidad.
            </Typography>
          </Box>
        </Box>

        {/* TÍTULO */}
        <Box className="register-heading">
          <Typography variant="h5" component="h2">
            Crear una cuenta
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Completá tus datos para registrarte en Donar+.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
            {success}
          </Alert>
        )}

        {/* FORMULARIO */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          className="register-form"
        >
          <Box className="register-fields-grid">
            <TextField
              label="Nombre"
              value={form.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              required
              fullWidth
            />

            <TextField
              label="Apellido"
              value={form.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              required
              fullWidth
            />

            <TextField
            label="Fecha de nacimiento"
            type="date"
            value={form.birthDate}
            onChange={(e) => handleChange("birthDate", e.target.value)}
            slotProps={{
                inputLabel: { shrink: true },
                htmlInput: { max: today },
            }}
            required
            fullWidth
            />

            <TextField
              label="Género"
              select
              value={form.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
              required
              fullWidth
            >
              {GENDERS.map((gender) => (
                <MenuItem key={gender.value} value={gender.value}>
                  {gender.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Grupo sanguíneo"
              select
              value={form.bloodTypeId}
              onChange={(e) => handleChange("bloodTypeId", e.target.value)}
              required
              fullWidth
            >
              {BLOOD_TYPES.map((bloodType) => (
                <MenuItem key={bloodType.id} value={bloodType.id}>
                  {bloodType.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Factor RH"
              select
              value={form.rhFactorId}
              onChange={(e) => handleChange("rhFactorId", e.target.value)}
              required
              fullWidth
            >
              {RH_FACTORS.map((factor) => (
                <MenuItem key={factor.id} value={factor.id}>
                  {factor.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <TextField
            label="Correo electrónico"
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Contraseña"
            type="password"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            helperText="Debe tener al menos 8 caracteres."
            required
            fullWidth
          />

          <TextField
            label="Confirmar contraseña"
            type="password"
            value={form.confirmPassword}
            onChange={(e) =>
              handleChange("confirmPassword", e.target.value)
            }
            required
            fullWidth
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading || Boolean(success)}
            className="register-submit"
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Crear cuenta"
            )}
          </Button>
        </Box>

        <Box className="register-login-link">
          <Typography variant="body2" color="text.secondary">
            ¿Ya tenés una cuenta?{" "}
            <Link to="/login">Iniciá sesión</Link>
          </Typography>
        </Box>

        <Typography className="register-footer" variant="caption">
          Donar+ · Donar sangre es dar vida.
        </Typography>

      </Paper>
    </Box>
  );
}

export default Register;
