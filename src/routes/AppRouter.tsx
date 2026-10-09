
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import MainLayout from "../layouts/MainLayout";

import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";
import PlaceholderPage from "../pages/PlaceholderPage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta inicial */}
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        {/* Acceso para usuarios no autenticados */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />

        {/* Layout compartido para páginas protegidas */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/requests"
            element={<PlaceholderPage title="Solicitudes" />}
          />

          <Route
            path="/donations"
            element={<PlaceholderPage title="Donaciones" />}
          />

          <Route
            path="/blood-centers"
            element={<PlaceholderPage title="Hemocentros" />}
          />

          <Route
            path="/users"
            element={<PlaceholderPage title="Usuarios" />}
          />
        </Route>

        {/* Ruta desconocida */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;