import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const navigationItems = [
  {
    label: "Inicio",
    path: "/dashboard",
    roles: ["ADMIN", "HEMOADMIN", "USER"],
  },
  {
    label: "Solicitudes",
    path: "/requests",
    roles: ["ADMIN", "HEMOADMIN", "USER"],
  },
  {
    label: "Donaciones",
    path: "/donations",
    roles: ["ADMIN", "HEMOADMIN", "USER"],
  },
  {
    label: "Hemocentros",
    path: "/blood-centers",
    roles: ["ADMIN", "HEMOADMIN"],
  },
  {
    label: "Usuarios",
    path: "/users",
    roles: ["ADMIN"],
  },
];

function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const visibleItems = navigationItems.filter((item) =>
    item.roles.some((role) => user?.roles.includes(role))
  );

  return (
    <div>
      <header>
        <h1>Donar+</h1>
       <nav>
          {visibleItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

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