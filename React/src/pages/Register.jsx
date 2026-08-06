import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createuser } from "../api/users";
import "../css/Login.css";
import "../css/Register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [tenantSlug, setTenantSlug] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleregister = async (e) => {
    e.preventDefault();

    if (!tenantName.trim() && !tenantSlug.trim()) {
      alert("Ingresa el nombre del negocio o su identificador para crear uno nuevo o unirte a uno existente.");
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await createuser({
        Username: username,
        Password: password,
        TenantName: tenantName,
        TenantSlug: tenantSlug,
      });

      if (result) {
        alert("Usuario registrado con éxito");
        navigate("/login");
      } else {
        alert("Error al registrar usuario");
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      alert("Ocurrió un error al registrar el usuario");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <span className="auth-kicker">JenApp</span>
        <h2>Registrar negocio</h2>
        <p className="auth-subtitle">Crea tu usuario y únete a un negocio existente o crea uno nuevo.</p>

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
            placeholder="Ej: Mi tienda (opcional si ya existe)"
            value={tenantName}
            onChange={(e) => setTenantName(e.target.value)}
          />

          <label>Slug del negocio</label>
          <input
            type="text"
            placeholder="Ej: mi-tienda (si ya existe, se añadirá ahí)"
            value={tenantSlug}
            onChange={(e) => setTenantSlug(e.target.value)}
          />
          <p className="auth-helper">
            Si el negocio ya existe, escribe su slug. Si no existe, se creará con el nombre proporcionado.
          </p>

          <label>Contraseña</label>
          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Registrando..." : "Registrar"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="back-button"
            disabled={isSubmitting}
          >
            Volver al inicio de sesión
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
