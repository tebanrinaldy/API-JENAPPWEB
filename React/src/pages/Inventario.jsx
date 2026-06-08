import { useEffect, useState } from "react";
import { FiArchive, FiCalendar, FiRefreshCw } from "react-icons/fi";
import { getproductos } from "../api/productos";
import { getMovimientos, registrarMovimiento } from "../api/inventario";
import "../css/Inventario.css";

function Inventario() {
  const [productos, setProductos] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [productoId, setProductoId] = useState("");
  const [tipo, setTipo] = useState("Entrada");
  const [cantidad, setCantidad] = useState("");
  const [razon, setRazon] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("");

  const cargarDatos = async () => {
    try {
      const prods = await getproductos();
      const movs = await getMovimientos();
      setProductos(prods);
      setMovimientos(movs);
    } catch (err) {
      console.error("Error al cargar el inventario:", err);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cantNum = parseInt(cantidad);

    if (!productoId || cantNum <= 0) {
      alert("Por favor, completa todos los campos correctamente.");
      return;
    }

    const movimiento = {
      productId: parseInt(productoId),
      type: tipo,
      quantity: cantNum,
      reason: razon,
    };

    try {
      await registrarMovimiento(movimiento);
      alert("Movimiento registrado exitosamente");
      setCantidad("");
      setRazon("");
      cargarDatos();
    } catch (error) {
      alert(error.message);
    }
  };

  const movimientosFiltrados = fechaFiltro
    ? movimientos.filter((m) => {
        const fechaMovimiento = new Date(m.date).toISOString().slice(0, 10);
        return fechaMovimiento === fechaFiltro;
      })
    : movimientos;

  return (
    <div className="inventario-page">
      <header className="page-hero">
        <div>
          <h2>Gestión de inventario</h2>
          <p>Registra entradas y salidas, revisa existencias y audita movimientos.</p>
        </div>
      </header>

      <section className="inventario-layout">
        <form className="inventario-form surface-panel" onSubmit={handleSubmit}>
          <div className="section-heading">
            <div>
              <h3>Nuevo movimiento</h3>
              <p>Actualiza el stock de un producto.</p>
            </div>
          </div>

          <select
            className="form-select"
            value={productoId}
            onChange={(e) => setProductoId(e.target.value)}
            required
          >
            <option value="">Selecciona un producto</option>
            {productos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select className="form-select" value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="Entrada">Entrada</option>
            <option value="Salida">Salida</option>
          </select>

          <input
            type="number"
            className="form-control"
            placeholder="Cantidad"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            required
          />

          <input
            type="text"
            className="form-control"
            placeholder="Razón (opcional)"
            value={razon}
            onChange={(e) => setRazon(e.target.value)}
          />

          <button className="btn btn-primary">
            <FiRefreshCw /> Registrar
          </button>
        </form>

        <section className="surface-panel inventario-stock">
          <div className="section-heading">
            <div>
              <h3>Inventario actual</h3>
              <p>{productos.length} producto(s) en seguimiento.</p>
            </div>
          </div>

          <div className="inventario-stock-list">
            {productos.map((p) => (
              <div key={p.id} className="stock-row">
                <span>
                  <FiArchive /> {p.name}
                </span>
                <strong>{p.stock} unidades</strong>
              </div>
            ))}
          </div>
        </section>
      </section>

      <section className="surface-panel movimientos-panel">
        <div className="movimientos-header">
          <div className="section-heading">
            <div>
              <h3>Historial de movimientos</h3>
              <p>Consulta las entradas y salidas registradas.</p>
            </div>
          </div>

          <label className="fecha-filter">
            <FiCalendar />
            <input
              type="date"
              className="form-control"
              value={fechaFiltro}
              onChange={(e) => setFechaFiltro(e.target.value)}
            />
          </label>
        </div>

        <div className="movimientos-list">
          {movimientosFiltrados.map((m) => (
            <article key={m.id} className="movimiento-card">
              <div>
                <strong>{m.product?.name}</strong>
                <span>{new Date(m.date).toLocaleString()}</span>
              </div>
              <div className={`movimiento-type ${m.type?.toLowerCase()}`}>
                {m.type}
              </div>
              <p>
                {m.quantity} unidades · {m.reason || "Sin razón"}
              </p>
            </article>
          ))}

          {movimientosFiltrados.length === 0 && (
            <p className="movimientos-empty">No hay movimientos para mostrar.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Inventario;
