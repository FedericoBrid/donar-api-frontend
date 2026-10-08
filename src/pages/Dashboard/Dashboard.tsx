import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", {replace: true});
  };

  return (
    <div>
      <h1>Donar+ Dashboard</h1>

      <p>
        Bienvenido, {user?.firstName} {user?.lastName}
      </p>

      <p>Email: {user?.email}</p>

      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
}

export default Dashboard