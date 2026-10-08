import { useAuth } from "../../context/useAuth";

function Dashboard() {
  const { user } = useAuth();

  return (
    <section>
      <h2>Dashboard</h2>

      <p>Bienvenido, {user?.firstName}</p>
      <p>Email: {user?.email}</p>
    </section>
  );
}

export default Dashboard