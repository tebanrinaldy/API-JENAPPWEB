import { useState } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import { Spanish } from "flatpickr/dist/l10n/es.js";
import { FiDownload, FiFileText, FiSearch } from "react-icons/fi";
import {
  exportSaleTicketPdf,
  exportSalesReportPdf,
  getSalesReport,
} from "../api/reports";
import "../css/ReportesVentas.css";

function ReportesVentas() {
  const [modo, setModo] = useState("dia");
  const [fechaDia, setFechaDia] = useState(null);
  const [rango, setRango] = useState([]);
  const [reporte, setReporte] = useState(null);

  const obtenerFechas = () => {
    if (modo === "dia") {
      if (!fechaDia) return null;
      const d = Array.isArray(fechaDia) ? fechaDia[0] : fechaDia;
      const fecha = d.toISOString().split("T")[0];
      return { from: fecha, to: fecha };
    }

    if (rango.length !== 2) return null;

    return {
      from: rango[0].toISOString().split("T")[0],
      to: rango[1].toISOString().split("T")[0],
    };
  };

  const buscar = async () => {
    const fechas = obtenerFechas();
    if (!fechas) return alert("Seleccione fechas válidas");

    try {
      const data = await getSalesReport(fechas.from, fechas.to);
      setReporte(data);
    } catch {
      alert("Error al cargar el reporte");
    }
  };

  const exportarPdf = () => {
    const fechas = obtenerFechas();
    if (!fechas) return alert("Seleccione fechas válidas");

    exportSalesReportPdf(fechas.from, fechas.to);
  };

  return (
    <div className="reportes-page">
      <header className="page-hero">
        <div>
          <h2>Reportes de ventas</h2>
          <p>Consulta resultados por día o rango y exporta informes en PDF.</p>
        </div>
      </header>

      <section className="reporte-filtros surface-panel">
        <div className="modo-switch">
          <button
            onClick={() => setModo("dia")}
            className={modo === "dia" ? "active" : ""}
          >
            Por día
          </button>
          <button
            onClick={() => setModo("rango")}
            className={modo === "rango" ? "active" : ""}
          >
            Por rango
          </button>
        </div>

        {modo === "dia" ? (
          <Flatpickr
            options={{ locale: Spanish, dateFormat: "Y-m-d" }}
            value={fechaDia || ""}
            onChange={(dates) => setFechaDia(dates[0] || null)}
            className="form-control"
          />
        ) : (
          <Flatpickr
            options={{ locale: Spanish, mode: "range", dateFormat: "Y-m-d" }}
            value={rango}
            onChange={(dates) => setRango(dates)}
            className="form-control"
          />
        )}

        <div className="reporte-actions">
          <button className="btn btn-success" onClick={buscar}>
            <FiSearch /> Buscar
          </button>
          <button className="btn btn-secondary" onClick={exportarPdf}>
            <FiDownload /> Exportar PDF
          </button>
        </div>
      </section>

      {reporte && (
        <section className="reporte-resultados">
          <div className="reporte-summary">
            <article>
              <span>Total vendido</span>
              <strong>${reporte.totalGeneral.toLocaleString()}</strong>
            </article>
            <article>
              <span>Cantidad ventas</span>
              <strong>{reporte.cantidadVentas}</strong>
            </article>
            <article>
              <span>Promedio por venta</span>
              <strong>${reporte.promedioVentas.toLocaleString()}</strong>
            </article>
          </div>

          <div className="section-heading">
            <div>
              <h3>
                Resultados: {new Date(reporte.desde).toLocaleDateString()} -{" "}
                {new Date(reporte.hasta).toLocaleDateString()}
              </h3>
              <p>Detalle de ventas incluidas en el reporte.</p>
            </div>
          </div>

          <div className="reporte-ventas">
            {reporte.ventas.map((v) => (
              <article key={v.id} className="reporte-venta-card surface-panel">
                <div className="reporte-venta-head">
                  <div>
                    <h4>Venta #{v.id}</h4>
                    <p>
                      {v.cliente} · {new Date(v.fecha).toLocaleString()}
                    </p>
                  </div>
                  <button
                    className="btn btn-sm btn-outline-dark"
                    onClick={() => exportSaleTicketPdf(v.id)}
                  >
                    <FiFileText /> Ticket PDF
                  </button>
                </div>

                <div className="reporte-total">
                  Total venta: <strong>${v.totalVenta.toLocaleString()}</strong>
                </div>

                <div className="table-responsive">
                  <table className="table table-sm table-striped mt-3">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Cant.</th>
                        <th>P. Unit</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {v.detalles.map((d, i) => (
                        <tr key={i}>
                          <td>{d.producto}</td>
                          <td>{d.cantidad}</td>
                          <td>${d.precioUnit.toLocaleString()}</td>
                          <td>${d.subtotal.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ReportesVentas;
