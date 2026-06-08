import { useEffect, useState } from "react";
import { FiAlertTriangle, FiBox, FiDollarSign, FiShoppingBag } from "react-icons/fi";
import { getproductos } from "../api/productos";
import { getSales } from "../api/sales";
import SalesChart from "../components/SalesChart";
import VentasPendientes from "../components/VentasPendientes";
import "../css/Dashboard.css";

function Dashboard() {
  const [productos, setProductos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const prods = await getproductos();
        const sales = await getSales();
        setProductos(prods);
        setVentas(sales);
      } catch (err) {
        console.error("Error cargando datos del dashboard:", err);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  const esHoy = (fecha) => {
    if (!fecha) return false;
    const f = new Date(fecha);
    const hoy = new Date();
    return f.toDateString() === hoy.toDateString();
  };

  const ventasHoy = ventas.filter((v) => esHoy(v.date ?? v.Date));
  const totalVentasHoy = ventasHoy.reduce(
    (acum, v) => acum + (Number(v.total ?? v.Total ?? 0) || 0),
    0
  );
  const cantidadVentasHoy = ventasHoy.length;
  const stockMinimoPorDefecto = 5;
  const productosBajoStock = productos.filter((p) => {
    const stockMinimo = p.stockMin ?? stockMinimoPorDefecto;
    return (p.stock ?? 0) <= stockMinimo;
  }).length;

  if (cargando) {
    return <p className="p-4">Cargando dashboard...</p>;
  }

  const stats = [
    {
      label: "Total vendido hoy",
      value: `$${totalVentasHoy.toLocaleString("es-CO")}`,
      caption: "Suma de las ventas registradas hoy",
      icon: FiDollarSign,
      tone: "primary",
    },
    {
      label: "Ventas de hoy",
      value: cantidadVentasHoy,
      caption: "Tickets emitidos durante el día",
      icon: FiShoppingBag,
      tone: "green",
    },
    {
      label: "Productos",
      value: productos.length,
      caption: "Artículos activos en el catálogo",
      icon: FiBox,
      tone: "neutral",
    },
    {
      label: "Stock bajo",
      value: productosBajoStock,
      caption: "Productos que necesitan revisión",
      icon: FiAlertTriangle,
      tone: "warning",
    },
  ];

  return (
    <div className="dashboard-container">
      <div className="page-hero dashboard-hero">
        <div>
          <h2>Dashboard general</h2>
          <p>Resumen operativo de ventas, pedidos y estado del inventario.</p>
        </div>
        <div className="dashboard-hero-badge">
          <span>Hoy</span>
          <strong>{new Date().toLocaleDateString("es-CO")}</strong>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map(({ label, value, caption, icon: Icon, tone }) => (
          <article key={label} className={`stat-card stat-card-${tone}`}>
            <div className="stat-icon">
              <Icon />
            </div>
            <p className="stat-label">{label}</p>
            <h3 className="stat-value">{value}</h3>
            <span className="stat-caption">{caption}</span>
          </article>
        ))}
      </div>

      <section className="soft-card chart-card">
        <div className="section-heading">
          <div>
            <h3>Ventas por día</h3>
            <p>Historial reciente para detectar movimiento y temporadas fuertes.</p>
          </div>
        </div>
        <SalesChart ventas={ventas} />
      </section>

      <VentasPendientes />

      <section className="stock-section">
        <div className="section-heading">
          <div>
            <h3>Stock disponible</h3>
            <p>Revisión rápida del inventario actual por producto.</p>
          </div>
        </div>

        <div className="stock-grid">
          {productos.map((p) => {
            const stockMinimo = p.stockMin ?? stockMinimoPorDefecto;
            const stockActual = p.stock ?? 0;
            const estaBajo = stockActual <= stockMinimo;

            return (
              <article
                key={p.id}
                className={`stock-card ${estaBajo ? "stock-card-low" : ""}`}
              >
                <div>
                  <h4 title={p.name}>{p.name}</h4>
                  <p>
                    <strong>{stockActual}</strong> unidades disponibles
                  </p>
                  <small>Mínimo recomendado: {stockMinimo}</small>
                </div>

                {estaBajo && (
                  <span className="stock-alert">Stock bajo</span>
                )}
              </article>
            );
          })}

          {productos.length === 0 && (
            <div className="surface-panel empty-state">
              No hay productos registrados en el inventario.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
