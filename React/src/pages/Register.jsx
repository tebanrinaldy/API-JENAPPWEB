import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createuser } from "../api/users";
import "../css/Register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [tenantSlug, setTenantSlug] = useState("");
  const navigate = useNavigate();

  const handleregister = async (e) => {
    e.preventDefault();

    try {
      const result = await createuser({
        Username: username,
        Password: password,
        TenantName: tenantName,
        TenantSlug: tenantSlug,
      });

      if (result) {
        alert("Usuario registrado con exito");
        navigate("/login");
      } else {
        alert("Error al registrar usuario");
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      alert("Ocurrio un error al registrar el usuario");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Registrar negocio</h2>
        <form onSubmit={handleregister}>
          <label>Usuario administrador</label>
          <input
            type="text"
            placeholder="Ingresa el usuario administrador"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label>Nombre del negocio</label>
          <input
            type="text"
            placeholder="Ej: Mi tienda"
            value={tenantName}
            onChange={(e) => setTenantName(e.target.value)}
            required
          />

          <label>Identificador publico</label>
          <input
            type="text"
            placeholder="Ej: mi-tienda"
            value={tenantSlug}
            onChange={(e) => setTenantSlug(e.target.value)}
          />

          <label>Contrasena</label>
          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Registrar</button>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="back-button"
          >
            Volver al inicio de sesion
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
