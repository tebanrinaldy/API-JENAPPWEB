import { useEffect, useMemo, useState } from "react";
import {
  getPendingSales,
  confirmPendingSale,
  rejectPendingSale,
} from "../api/pendingSales";
import { HubConnectionBuilder } from "@microsoft/signalr";
import Notification from "./Notification";
import { BASE_API_URL } from "../api/baseurl";
function VentasPendientes() {
  const [pendientes, setPendientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [connection, setConnection] = useState(null);
  const [notification, setNotification] = useState(null);

  const notificationsound = useMemo(() => new Audio("/sounds/sound.mp3"), []);

  const cargarPendientes = async () => {
    try {
      const data = await getPendingSales();
      setPendientes(data);
    } catch (err) {
      console.error("Error cargando ventas pendientes:", err);
    } finally {
      setCargando(false);
    }
  };
  useEffect(() => {
    const desbloquearAudio = () => {
      notificationsound.volume = 0;
      notificationsound.play().then(() => {
        notificationsound.pause();
        notificationsound.currentTime = 0;
        notificationsound.volume = 1;
      });
      window.removeEventListener("click", desbloquearAudio);
    };

    window.addEventListener("click", desbloquearAudio);
  }, [notificationsound]);

  useEffect(() => {
    cargarPendientes();
    const nuevaConexion = new HubConnectionBuilder()
      .withUrl(`${BASE_API_URL}/hub/notifications`, {
        accessTokenFactory: () => sessionStorage.getItem("token") || "",
      })
      .withAutomaticReconnect()
      .build();

    setConnection(nuevaConexion);
  }, []);

  useEffect(() => {
    if (!connection) return;

    connection
      .start()
      .then(() => {
        connection.on("PendingSaleCreated", () => {
          setNotification("¡Nueva venta pendiente!");
          notificationsound.play();
          cargarPendientes();
        });

        connection.on("PendingSaleUpdated", () => {
          cargarPendientes();
        });
      })
      .catch((err) => console.error("Error al conectar a SignalR:", err));
  }, [connection, notificationsound]);

  const confirmar = async (id) => {
    if (!confirm("¿Confirmar esta venta?")) return;
    await confirmPendingSale(id);
    cargarPendientes();
  };

  const rechazar = async (id) => {
    if (!confirm("¿Rechazar esta venta?")) return;
    await rejectPendingSale(id);
    cargarPendientes();
  };

  if (cargando) return <p>Cargando ventas pendientes...</p>;

  return (
    <>
      {notification && (
        <Notification
          message={notification}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="card shadow-sm soft-card mt-4">
        <div className="card-body">
          <div className="d-flex justify-content-between mb-3">
            <h5 className="card-title mb-0">Ventas pendientes por aprobar</h5>
          </div>

          {pendientes.length === 0 ? (
            <p className="text-muted">No hay ventas pendientes.</p>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Contacto</th>
                    <th>Dirección</th>
                    <th>Método pago</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Detalles</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {pendientes.map((v) => (
                    <tr key={v.id}>
                      <td>
                        <strong>{v.client}</strong>
                      </td>

                      <td>
                        <div className="small">
                          {v.phone && <div>📞 {v.phone}</div>}
                          {v.email && <div>✉️ {v.email}</div>}
                        </div>
                      </td>

                      <td>
                        {v.address ? (
                          <span>{v.address}</span>
                        ) : (
                          <span className="text-muted small">
                            Sin dirección
                          </span>
                        )}
                      </td>

                      <td>
                        {v.paymentMethod ? (
                          <span>{v.paymentMethod}</span>
                        ) : (
                          <span className="text-muted small">
                            Sin especificar
                          </span>
                        )}
                      </td>

                      <td>{new Date(v.date).toLocaleString()}</td>

                      <td>
                        <strong>${v.total.toLocaleString()}</strong>
                      </td>

                      <td>
                        <ul className="small">
                          {v.details.map((d) => (
                            <li key={d.id}>
                              {d.product?.name ?? "Producto"} • Cant:{" "}
                              {d.quantity} • Unit: $
                              {d.unitPrice.toLocaleString()}
                            </li>
                          ))}
                        </ul>
                      </td>

                      <td>
                        <div className="btn-group">
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => confirmar(v.id)}
                          >
                            ✔ Aprobar
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => rechazar(v.id)}
                          >
                            ✖ Rechazar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default VentasPendientes;
