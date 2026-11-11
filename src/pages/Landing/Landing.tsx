
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
            <a href="#hemocentros">Hemocentros</a>
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

        {/* BENEFICIOS */}
        <Box
          component="section"
          id="beneficios"
          className="landing-benefits"
        >
          <Container maxWidth="lg">
            <Box className="landing-benefits-content">
              <Box className="landing-benefits-intro">
                <Typography component="span" className="landing-eyebrow">
                  UNA COMUNIDAD QUE AYUDA
                </Typography>

                <Typography component="h2">
                  La solidaridad también necesita organización.
                </Typography>

                <Typography component="p">
                  Donar+ facilita el encuentro entre personas dispuestas
                  a donar sangre y quienes necesitan recibirla.
                </Typography>

                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  className="landing-benefits-button"
                >
                  Quiero formar parte
                </Button>
              </Box>

              <Box className="landing-benefits-grid">
                <Box className="landing-benefit-item">
                  <Box className="landing-benefit-icon">
                    <BloodtypeOutlined />
                  </Box>
                  <Typography component="h3">
                    Solicitudes disponibles
                  </Typography>
                  <Typography component="p">
                    Consultá las necesidades de sangre publicadas
                    por los hemocentros.
                  </Typography>
                </Box>

                <Box className="landing-benefit-item">
                  <Box className="landing-benefit-icon">
                    <FavoriteBorder />
                  </Box>
                  <Typography component="h3">
                    Tu colaboración importa
                  </Typography>
                  <Typography component="p">
                    Registrá tu intención de donar y ayudá a que
                    cada solicitud encuentre posibles donantes.
                  </Typography>
                </Box>

                <Box className="landing-benefit-item">
                  <Box className="landing-benefit-icon">
                    <GroupsOutlined />
                  </Box>
                  <Typography component="h3">
                    Información centralizada
                  </Typography>
                  <Typography component="p">
                    Encontrá información sobre solicitudes y
                    hemocentros desde un mismo lugar.
                  </Typography>
                </Box>

                <Box className="landing-benefit-item">
                  <Box className="landing-benefit-icon">
                    <VolunteerActivismOutlined />
                  </Box>
                  <Typography component="h3">
                    Una comunidad solidaria
                  </Typography>
                  <Typography component="p">
                    Formá parte de una red de personas comprometidas
                    con la donación voluntaria.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* HEMOCENTROS */}
        <Box
          component="section"
          id="hemocentros"
          className="landing-blood-centers"
        >
          <Container maxWidth="lg">
            <Box className="landing-blood-centers-content">
              <Box className="landing-blood-centers-icon">
                <BloodtypeOutlined />
              </Box>

              <Box className="landing-blood-centers-text">
                <Typography component="span" className="landing-eyebrow">
                  TRABAJAMOS EN CONJUNTO
                </Typography>

                <Typography component="h2">
                  Los hemocentros son parte fundamental de esta comunidad.
                </Typography>

                <Typography component="p">
                  Donar+ permite consultar solicitudes de sangre
                  vinculadas a los hemocentros y facilita el contacto
                  entre las personas y las instituciones que las necesitan.
                </Typography>
              </Box>

              <Button
                component={Link}
                to="/register"
                variant="contained"
                className="landing-centers-button"
              >
                Sumate a Donar+
              </Button>
            </Box>
          </Container>
        </Box>
        {/* CTA FINAL */}
        <Box component="section" className="landing-final-cta">
          <Container maxWidth="lg">
            <Box className="landing-final-cta-content">
              <Box className="landing-final-cta-icon">
                <VolunteerActivismOutlined />
              </Box>

              <Typography component="h2">
                Tu ayuda puede cambiar una vida.
              </Typography>

              <Typography component="p">
                Sumate a Donar+ y formá parte de una comunidad
                comprometida con la donación de sangre.
              </Typography>

              <Button
                component={Link}
                to="/register"
                variant="contained"
                className="landing-final-cta-button"
              >
                Crear mi cuenta
                <span className="landing-cta-arrow">→</span>
              </Button>
            </Box>
          </Container>
        </Box>

        {/* FOOTER */}
        <Box component="footer" className="landing-footer">
          <Container maxWidth="xl">
            <Box className="landing-footer-content">
              <Box className="landing-footer-brand">
                <Link to="/" className="landing-logo">
                  <VolunteerActivismOutlined />
                  <Typography component="span">
                    Donar<span>+</span>
                  </Typography>
                </Link>

                <Typography component="p">
                  Donar sangre es dar vida.
                </Typography>
              </Box>

              <Box className="landing-footer-links">
                <Typography component="span">Explorá</Typography>
                <a href="#como-funciona">Cómo funciona</a>
                <a href="#beneficios">Beneficios</a>
                <a href="#hemocentros">Hemocentros</a>
              </Box>

              <Box className="landing-footer-links">
                <Typography component="span">Tu cuenta</Typography>
                <Link to="/register">Registrarme</Link>
                <Link to="/login">Iniciar sesión</Link>
              </Box>
            </Box>

            <Box className="landing-footer-bottom">
              <Typography component="p">
                © {new Date().getFullYear()} Donar+. Todos los derechos reservados.
              </Typography>

              <Typography component="p">
                Donar sangre es dar vida.
              </Typography>
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  );
}

export default Landing;
