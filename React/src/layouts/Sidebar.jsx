import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import logo from "../assets/logo jenweb.png";
import {
  FiBarChart2,
  FiBox,
  FiFolder,
  FiHome,
  FiLayers,
  FiShoppingCart,
} from "react-icons/fi";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <img src={logo} alt="Logo de JenApp" className="sidebar-logo" />
        <div>
          <h2 className="sidebar-title">JenApp</h2>
          <span className="sidebar-subtitle">Gestión comercial</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className="sidebar-btn">
          <FiHome className="icon" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/venta" className="sidebar-btn">
          <FiShoppingCart className="icon" />
          <span>Ventas</span>
        </NavLink>

        <NavLink to="/categorias" className="sidebar-btn">
          <FiFolder className="icon" />
          <span>Categorías</span>
        </NavLink>

        <NavLink to="/productos" className="sidebar-btn">
          <FiBox className="icon" />
          <span>Productos</span>
        </NavLink>

        <NavLink to="/inventario" className="sidebar-btn">
          <FiLayers className="icon" />
          <span>Inventario</span>
        </NavLink>

        <NavLink to="/reportes-ventas" className="sidebar-btn">
          <FiBarChart2 className="icon" />
          <span>Reportes</span>
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;
