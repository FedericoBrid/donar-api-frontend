import { useState } from "react";
import { useAuth } from "../../context/useAuth";
import type { AuthResponse } from "../../types/auth";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

function Login() {

  const {login} = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    try{
      const response = await api.post<AuthResponse>("/auth/login", {
        email,
        password,
      });
  
      login(response.data);
  
      navigate("/dashboard");
    } catch (error) {
      setError("Credenciales inválidas");
    }

  };

  return (
    <div>
      <h1>Donar+</h1>
      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <button type="submit">
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}

export default Login;