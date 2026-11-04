
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
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
  EmailOutlined,
  VolunteerActivismOutlined,
} from "@mui/icons-material";

import api from "../../services/api";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await api.post("/auth/forgot-password", {
        email: email.trim(),
      });

      setSuccess(true);
    } catch {
      setError(
        "No pudimos procesar la solicitud. Intentá nuevamente más tarde.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="forgot-page">
      <Paper className="forgot-card" elevation={0}>
        <Box className="forgot-brand">
          <Box className="forgot-logo">
            <VolunteerActivismOutlined />
          </Box>

          <Typography sx={{ fontWeight: 800, fontSize: "2rem" }}>
            Donar<span>+</span>
          </Typography>

          <Typography color="text.secondary" variant="body2">
            Donar sangre es dar vida.
          </Typography>
        </Box>

        <Box className="forgot-heading">
          <Typography  variant="h5" sx={{ fontWeight: 700 }}>
            Recuperar contraseña
          </Typography>

          <Typography color="text.secondary" variant="body2">
            Ingresá tu correo electrónico y te enviaremos las instrucciones
            para restablecer tu contraseña.
          </Typography>
        </Box>

        {success && (
          <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
            Si existe una cuenta asociada a ese correo, recibirás un mensaje
            con las instrucciones para recuperar tu contraseña.
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          className="forgot-form"
        >
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="nombre@ejemplo.com"
            autoComplete="email"
            required
            fullWidth
            disabled={loading || success}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading || !email.trim() || success}
            className="forgot-submit"
          >
            {loading ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Enviando...
              </>
            ) : (
              "Enviar instrucciones"
            )}
          </Button>
        </Box>

        <Button
          component={RouterLink}
          to="/login"
          startIcon={<ArrowBackOutlined />}
          className="forgot-back"
          fullWidth
        >
          Volver al inicio de sesión
        </Button>

        <Typography className="forgot-footer" variant="caption">
          Donar+ · Sistema de gestión de donaciones de sangre
        </Typography>
      </Paper>
    </Box>
  );
}

export default ForgotPassword;
