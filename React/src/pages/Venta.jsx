import { useEffect, useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import VentaModal from "../components/VentaModal";
import VentaList from "../components/VentaList";
import { getSales } from "../api/sales";
import { exportSaleTicketPdf } from "../api/reports";
import "../css/Venta.css";

function Venta() {
  const [ventas, setVentas] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [fechaFiltro, setFechaFiltro] = useState("");

  useEffect(() => {
    const cargarVentas = async () => {
      try {
        const data = await getSales();
        setVentas(data);
      } catch (error) {
        console.error("Error al obtener las ventas:", error);
      }
    };
    cargarVentas();
  }, []);

  const actualizarVentas = async () => {
    const data = await getSales();
    setVentas(data);
  };

  const ventasFiltradas = fechaFiltro
    ? ventas.filter((v) => {
        const fechaVenta = new Date(v.date ?? v.Date).toISOString().slice(0, 10);
        return fechaVenta === fechaFiltro;
      })
    : ventas;

  const manejarVerTicket = async (venta) => {
    if (!venta?.id) return;
    try {
      await exportSaleTicketPdf(venta.id);
    } catch (err) {
      console.error(err);
      alert("Error al generar el ticket");
    }
  };

  return (
    <div className="venta-page">
      <div className="page-hero">
        <div>
          <h2>Ventas realizadas</h2>
          <p>Consulta, filtra y administra las ventas de tu negocio.</p>
        </div>

        <button className="btn btn-success btn-lg" onClick={() => setMostrarModal(true)}>
          <FiPlus /> Añadir venta
        </button>
      </div>

      <div className="filtro-card surface-panel">
        <div className="filtro-content">
          <div>
            <label className="form-label mb-1">Filtrar por fecha</label>
            <input
              type="date"
              className="form-control"
              value={fechaFiltro}
              onChange={(e) => setFechaFiltro(e.target.value)}
            />
          </div>

          {fechaFiltro && (
            <button className="btn btn-outline-secondary" onClick={() => setFechaFiltro("")}>
              <FiX /> Limpiar filtro
            </button>
          )}
        </div>
      </div>

      <VentaList ventas={ventasFiltradas} onVerTicket={manejarVerTicket} />

      {mostrarModal && (
        <VentaModal onClose={() => setMostrarModal(false)} onConfirm={actualizarVentas} />
      )}
    </div>
  );
}

export default Venta;
