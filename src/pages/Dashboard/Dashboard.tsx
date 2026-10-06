import { useAuth } from "../../context/useAuth";

function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Donar+ Dashboard</h1>

      <p>
        Bienvenido, {user?.firstName} {user?.lastName}
      </p>

      <p>Email: {user?.email}</p>
    </div>
  );
}

export default Dashboard