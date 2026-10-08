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

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main route */}
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        {/* Access for user not authenticated */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />

        {/* Shared layout for protected pages */}
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

          {/* More protected pages will go here */}
        </Route>

        {/* Unknown route */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;