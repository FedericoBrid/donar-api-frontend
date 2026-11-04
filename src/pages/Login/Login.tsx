
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  EmailOutlined,
  LockOutlined,
  VolunteerActivismOutlined,
} from "@mui/icons-material";

import { useAuth } from "../../context/useAuth";
import type { AuthResponse } from "../../types/auth";
import api from "../../services/api";
import "./Login.css";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post<AuthResponse>("/auth/login", {
        email,
        password,
      });

      await login(response.data);
      navigate("/dashboard");
    } catch {
      setError("Credenciales inválidas. Verificá tu email y contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="login-page">
      <Paper className="login-card" elevation={0}>
        <Box className="login-brand">
          <Box className="login-logo">
            <VolunteerActivismOutlined />
          </Box>

          <Typography sx={{ variant: "h4", fontWeight: 800 }}>
            Donar<span>+</span>
          </Typography>

          <Typography sx={{ color: "text.secondary", textAlign: "center" }}>
            Donar sangre es dar vida.
          </Typography>
        </Box>

        <Box className="login-heading">
          <Typography sx={{ variant: "h5", fontWeight: 700 }}>
            ¡Bienvenido!
          </Typography>

          <Typography color="text.secondary" variant="body2">
            Ingresá tus datos para continuar.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} className="login-form">
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="nombre@ejemplo.com"
            autoComplete="email"
            required
            fullWidth
            disabled={loading}
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

          <TextField
            label="Contraseña"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Ingresá tu contraseña"
            autoComplete="current-password"
            required
            fullWidth
            disabled={loading}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: -1 }}>
            <Button
              component={Link}
              to="/forgot-password"
              variant="text"
              size="small"
              sx={{
                color: "#D71920",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              ¿Olvidaste tu contraseña?
            </Button>
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading || !email.trim() || !password}
            className="login-submit"
          >
            {loading ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Ingresando...
              </>
            ) : (
              "Iniciar sesión"
            )}
          </Button>
        </Box>

        <Typography className="login-footer" variant="caption">
          Donar+ · Sistema de gestión de donaciones de sangre
        </Typography>
      </Paper>
    </Box>
  );
}

export default Login;
