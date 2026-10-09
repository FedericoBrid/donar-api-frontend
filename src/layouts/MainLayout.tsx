import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div>
      <header>
        <h1>Donar+</h1>

        <nav>
          <span>Bienvenido, {user?.firstName}</span>

          <p>Roles: {user?.roles.join(", ")}</p>

          <button type="button" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;