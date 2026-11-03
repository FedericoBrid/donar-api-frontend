
import { useState } from "react";

import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";

import {
  Dashboard as DashboardIcon,
  Bloodtype as BloodtypeIcon,
  VolunteerActivism as DonationIcon,
  LocalHospital as HospitalIcon,
  People as PeopleIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../context/useAuth";
import "./MainLayout.css";

const DRAWER_WIDTH = 260;

const navigationItems = [
  {
    label: "Inicio",
    path: "/dashboard",
    roles: ["ADMIN", "HEMOADMIN", "USER"],
    icon: <DashboardIcon />,
  },
  {
    label: "Solicitudes",
    path: "/requests",
    roles: ["ADMIN", "HEMOADMIN", "USER"],
    icon: <BloodtypeIcon />,
  },
  {
    label: "Mis Donaciones",
    path: "/donations",
    roles: ["ADMIN", "HEMOADMIN", "USER"],
    icon: <DonationIcon />,
  },
  {
    label: "Hemocentros",
    path: "/blood-centers",
    roles: ["ADMIN", "HEMOADMIN"],
    icon: <HospitalIcon />,
  },
  {
    label: "Usuarios",
    path: "/users",
    roles: ["ADMIN"],
    icon: <PeopleIcon />,
  },
  {
    label: "Gestión de donaciones",
    path: "/donation-management",
    roles: ["ADMIN", "HEMOADMIN"],
    icon: <DonationIcon />,
  },
];

function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);

  const roles = user?.roles ?? [];

  const visibleItems = navigationItems.filter((item) =>
    item.roles.some((role) => roles.includes(role)),
  );

  const handleLogout = () => {
    setMobileOpen(false);
    logout();
    navigate("/login", { replace: true });
  };

  const handleNavigation = () => {
    setMobileOpen(false);
  };

  const drawerContent = (
    <Box>
      <Box className="main-layout__brand">
        <BloodtypeIcon className="main-layout__brand-icon" />

        <Typography
          variant="h5"
          color="primary"
          sx={{ fontWeight: 800 }}
        >
          Donar+
        </Typography>
      </Box>

      <Divider />

      <List className="main-layout__navigation">
        {visibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/dashboard"}
            onClick={handleNavigation}
            className={({ isActive }) =>
              `main-layout__nav-link${isActive ? " active" : ""}`
            }
          >
            <ListItemButton className="main-layout__nav-item">
              <ListItemIcon>{item.icon}</ListItemIcon>

              <ListItemText
                primary={item.label}
                slotProps={{
                  primary: {
                    sx: {
                      fontSize: 14,
                      fontWeight: 600,
                    },
                  },
                }}
              />
            </ListItemButton>
          </NavLink>
        ))}
      </List>
    </Box>
  );

  return (
    <Box className="main-layout">
      {/* Menú lateral para escritorio */}
      <Drawer
        variant="permanent"
        className="main-layout__drawer"
        sx={{ display: { xs: "none", md: "block" } }}
        open
      >
        {drawerContent}
      </Drawer>

      {/* Menú lateral para dispositivos móviles */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            p: 1,
          }}
        >
          <IconButton
            onClick={() => setMobileOpen(false)}
            aria-label="Cerrar menú"
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {drawerContent}
      </Drawer>

      {/* Contenido principal */}
      <Box className="main-layout__content">
        <AppBar
          position="sticky"
          color="inherit"
          elevation={0}
          sx={{ borderBottom: "1px solid #E8EAED" }}
        >
          <Toolbar className="main-layout__toolbar">
            {/* Menú móvil */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <IconButton
                onClick={() => setMobileOpen(true)}
                sx={{ display: { xs: "inline-flex", md: "none" } }}
                aria-label="Abrir menú"
              >
                <MenuIcon />
              </IconButton>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  display: { xs: "block", md: "none" },
                }}
              >
                Donar+
              </Typography>
            </Box>

            {/* Usuario y cierre de sesión */}
            <Box className="main-layout__user">
              <Avatar
                sx={{
                  bgcolor: "primary.light",
                  color: "primary.dark",
                  fontWeight: 700,
                }}
              >
                {user?.firstName?.charAt(0).toUpperCase() ?? "U"}
              </Avatar>

              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
                  {user?.firstName}
                </Typography>

                <Typography
                  sx={{
                    color: "text.secondary",
                    fontSize: 12,
                  }}
                >
                  {roles.join(", ")}
                </Typography>
              </Box>

              <Button
                color="inherit"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{ ml: 1 }}
              >
                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                  Salir
                </Box>
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        <Box component="main" className="main-layout__main">
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default MainLayout;
