
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Typography,
} from "@mui/material";
import {
  FavoriteBorder,
  BloodtypeOutlined,
  GroupsOutlined,
  VolunteerActivismOutlined,
} from "@mui/icons-material";

import "./Landing.css";

function Landing() {
  return (
    <Box className="landing-page">
      {/* NAVBAR */}
      <Box component="header" className="landing-navbar">
        <Container maxWidth="xl" className="landing-navbar-content">
          <Link to="/" className="landing-logo">
            <VolunteerActivismOutlined />
            <Typography component="span">
              Donar<span>+</span>
            </Typography>
          </Link>

          <Box component="nav" className="landing-nav-links">
            <a href="#como-funciona">Cómo funciona</a>
            <a href="#beneficios">Beneficios</a>
            <a href="#preguntas">Preguntas frecuentes</a>
          </Box>

          <Box className="landing-nav-actions">
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              className="landing-login-button"
            >
              Ingresar
            </Button>

            <Button
              component={Link}
              to="/register"
              variant="contained"
              className="landing-register-button"
            >
              Registrarme
            </Button>
          </Box>
        </Container>
      </Box>

      {/* HERO */}
      <Box component="main">
        <Box component="section" className="landing-hero">
          <Container maxWidth="xl" className="landing-hero-content">
            <Box className="landing-hero-text">
              <Typography component="h1">
                Donar sangre
                <br />
                es dar <span>vida.</span>
              </Typography>

              <Typography component="p" className="landing-hero-description">
                Con tu donación, ayudás a quienes más lo necesitan.
              </Typography>

              <Box className="landing-hero-actions">
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  className="landing-hero-register"
                  endIcon={<span>→</span>}
                >
                  Registrarme
                </Button>

                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  className="landing-hero-login"
                >
                  Ingresar
                </Button>
              </Box>

              <Box className="landing-hero-features">
                <Box className="landing-feature">
                  <BloodtypeOutlined />
                  <Typography>Salvá vidas</Typography>
                </Box>

                <Box className="landing-feature">
                  <FavoriteBorder />
                  <Typography>Hacé la diferencia</Typography>
                </Box>

                <Box className="landing-feature">
                  <GroupsOutlined />
                  <Typography>Sumate a la comunidad</Typography>
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* CÓMO FUNCIONA */}
        <Box
        component="section"
        id="como-funciona"
        className="landing-how-it-works"
        >
        <Container maxWidth="lg">
            <Box className="landing-section-heading">
            <Typography component="span" className="landing-eyebrow">
                SIMPLE Y SOLIDARIO
            </Typography>

            <Typography component="h2">
                ¿Cómo funciona Donar+?
            </Typography>

            <Typography component="p">
                Dar el primer paso es más fácil de lo que imaginás.
                Te acompañamos durante todo el proceso.
            </Typography>
            </Box>

            <Box className="landing-steps">
            <Box className="landing-step-card">
                <Box className="landing-step-icon">
                <GroupsOutlined />
                </Box>

                <Typography component="span" className="landing-step-number">
                PASO 01
                </Typography>

                <Typography component="h3">
                Registrate
                </Typography>

                <Typography component="p">
                Creá tu cuenta en Donar+ y completá tus datos
                para formar parte de nuestra comunidad.
                </Typography>
            </Box>

            <Box className="landing-step-card">
                <Box className="landing-step-icon">
                <BloodtypeOutlined />
                </Box>

                <Typography component="span" className="landing-step-number">
                PASO 02
                </Typography>

                <Typography component="h3">
                Encontrá una solicitud
                </Typography>

                <Typography component="p">
                Consultá las solicitudes de sangre disponibles
                y conocé qué necesitan los hemocentros.
                </Typography>
            </Box>

            <Box className="landing-step-card">
                <Box className="landing-step-icon">
                <VolunteerActivismOutlined />
                </Box>

                <Typography component="span" className="landing-step-number">
                PASO 03
                </Typography>

                <Typography component="h3">
                Sumate a donar
                </Typography>

                <Typography component="p">
                Registrá tu intención de donar y colaborá
                con quienes necesitan sangre.
                </Typography>
            </Box>
            </Box>
        </Container>
        </Box>
      </Box>
    </Box>
  );
}

export default Landing;
