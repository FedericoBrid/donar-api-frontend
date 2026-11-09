
import { useEffect, useRef, useState } from "react";
import { Link as RouterLink, useNavigate, useSearchParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import {
  ArrowBackOutlined,
  LockOutlined,
  VolunteerActivismOutlined,
} from "@mui/icons-material";

import api from "../../services/api";
import "./ResetPassword.css";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [token] = useState(() => searchParams.get("token") ?? "");

  const tokenCleaned = useRef(false);

  useEffect(() => {
    if (tokenCleaned.current) return;

    tokenCleaned.current = true;

    if (searchParams.has("token")) {
      navigate("/reset-password", { replace: true });
    }
  }, [navigate, searchParams]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setError("");

    if (!token) {
      setError("El enlace de recuperación no es válido o no contiene un token.");
      return;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/reset-password", {
        token,
        newPassword: password,
      });

      setSuccess(true);
    } catch {
      const message =
        "El enlace de recuperación es inválido o ha expirado. Solicitá uno nuevo.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="reset-page">
      <Paper className="reset-card" elevation={0}>
        <Box className="reset-brand">
          <Box className="reset-logo">
            <VolunteerActivismOutlined />
          </Box>

          <Typography sx={{ fontWeight: 800, fontSize: "2rem" }}>
            Donar<span>+</span>
          </Typography>

          <Typography color="text.secondary" variant="body2">
            Donar sangre es dar vida.
          </Typography>
        </Box>

        <Box className="reset-heading">
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Nueva contraseña
          </Typography>

          <Typography color="text.secondary" variant="body2">
            Ingresá y confirmá tu nueva contraseña para recuperar el acceso.
          </Typography>
        </Box>

        {!token && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            El enlace no contiene un token de recuperación válido.
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
            Tu contraseña fue actualizada correctamente. Ya podés iniciar sesión.
          </Alert>
        )}

        {!success && (
          <Box
            component="form"
            onSubmit={handleSubmit}
            className="reset-form"
          >
            <TextField
              label="Nueva contraseña"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              placeholder="Mínimo 8 caracteres"
              required
              fullWidth
              disabled={loading || !token}
              slotProps={{
                htmlInput: { minLength: 8 },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              label="Confirmar contraseña"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              placeholder="Repetí tu contraseña"
              required
              fullWidth
              disabled={loading || !token}
              slotProps={{
                htmlInput: { minLength: 8 },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={
                loading ||
                !token ||
                !password ||
                !confirmPassword
              }
              className="reset-submit"
            >
              {loading ? (
                <>
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                  Actualizando...
                </>
              ) : (
                "Restablecer contraseña"
              )}
            </Button>
          </Box>
        )}

        {success ? (
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate("/login")}
            className="reset-submit"
            sx={{ mt: 2 }}
          >
            Ir al inicio de sesión
          </Button>
        ) : (
          <Button
            component={RouterLink}
            to="/login"
            startIcon={<ArrowBackOutlined />}
            className="reset-back"
            fullWidth
          >
            Volver al inicio de sesión
          </Button>
        )}

        <Typography className="reset-footer" variant="caption">
          Donar+ · Sistema de gestión de donaciones de sangre
        </Typography>
      </Paper>
    </Box>
  );
}

export default ResetPassword;
