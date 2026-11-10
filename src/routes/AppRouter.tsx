
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
import RoleRoute from "./RoleRoute";
import Requests from "../pages/Request/Requests";
import Donations from "../pages/Donations/Donations";
import DonationManagement from "../pages/Donations/DonationManagement";
import Users from "../pages/Users/Users";
import BloodCenters from "../pages/BloodCenters/BloodCenters";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import Landing from "../pages/Landing/Landing";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta inicial */}
        <Route path="/" element={<Landing />} />

        {/* Acceso para usuarios no autenticados */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />

        <Route
          path="/reset-password"
          element={
            <GuestRoute>
              <ResetPassword />
            </GuestRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <GuestRoute>
              <ForgotPassword />
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
            element={<Requests />}
          />

          <Route
            path="/donations"
            element={<Donations />}
          />

          {/* ADMIN y HEMOADMIN */}
          <Route
            element={
              <RoleRoute allowedRoles={["ADMIN", "HEMOADMIN"]} />
            }
          >
            <Route
              path="/donation-management"
              element={<DonationManagement />}
            />
          </Route>

          <Route
            element={
              <RoleRoute allowedRoles={["ADMIN", "HEMOADMIN"]} />
            }
          >
            <Route
              path="/blood-centers"
              element={<BloodCenters />}
            />
          </Route>

          {/* Solo ADMIN */}
          <Route
            element={
              <RoleRoute allowedRoles={["ADMIN"]} />
            }
          >
            <Route path="/users" element={<Users />} />
          </Route>
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