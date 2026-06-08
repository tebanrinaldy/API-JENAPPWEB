import "./Topbar.css";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import { FiExternalLink, FiLogOut, FiUser } from "react-icons/fi";

function Topbar() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [tenantSlug, setTenantSlug] = useState("");
  const [tenantName, setTenantName] = useState("");

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUsername(user.username);
      setTenantSlug(user.tenantSlug || "");
      setTenantName(user.tenantName || "");
    }
  }, []);

  const handlelogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    alert("Sesión cerrada correctamente");
    navigate("/login");
  };

  return (
    <div className="topbar">
      <div className="topbar-right">
        {tenantSlug && (
          <div className="topbar-tenant">
            <span className="topbar-tenant-name">{tenantName || "Negocio"}</span>
            <Link to={`/publico/${tenantSlug}`} className="topbar-public-link">
              <FiExternalLink /> /publico/{tenantSlug}
            </Link>
          </div>
        )}

        <span className="topbar-user">
          <FiUser /> {username}
        </span>

        <Button variant="outline-info" onClick={handlelogout} className="topbar-logout">
          <FiLogOut />
          Salir
        </Button>
      </div>
    </div>
  );
}

export default Topbar;
