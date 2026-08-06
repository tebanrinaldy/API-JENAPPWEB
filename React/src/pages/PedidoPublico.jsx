import { useMemo, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import CategoriaSelector from "../components/CategoriaSelector";
import VentaForm from "../components/VentaForm";
import "../css/PedidoPublico.css";
import { BASE_API_URL, getStoredTenantSlug, tenantHeaders } from "../api/baseurl";

const WHATSAPP_PHONE = "573043769901";

function PedidoPublico() {
  const { tenantSlug } = useParams();
  const effectiveTenantSlug = tenantSlug || getStoredTenantSlug();
  const [carrito, setCarrito] = useState([]);
  const [clienteData, setClienteData] = useState(null);
  const [ventaConfirmada, setVentaConfirmada] = useState(false);
  const [pedidoInfo, setPedidoInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const total = useMemo(
    () => carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0),
    [carrito]
  );

  const itemsCount = useMemo(
    () => carrito.reduce((acc, item) => acc + item.cantidad, 0),
    [carrito]
  );

  const incrementar = useCallback((id) => {
    setCarrito((prev) =>
      prev.map((it) =>
        it.id === id && it.cantidad < it.stock
          ? { ...it, cantidad: it.cantidad + 1 }
          : it
      )
    );
  }, []);

  const decrementar = useCallback((id) => {
    setCarrito((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, cantidad: Math.max(1, it.cantidad - 1) } : it
      )
    );
  }, []);

  const eliminar = useCallback((id) => {
    setCarrito((prev) => prev.filter((it) => it.id !== id));
  }, []);

  const handleConfirm = async () => {
    if (!clienteData || carrito.length === 0 || loading) return;
    setLoading(true);

    const body = {
      client: clienteData.client,
      email: clienteData.email,
      phone: clienteData.phone,
      paymentMethod: clienteData.paymentMethod,
      address: clienteData.address,
      details: carrito.map((item) => ({
        productId: item.id,
        quantity: item.cantidad,
        unitPrice: item.precio,
        totalPrice: item.precio * item.cantidad,
      })),
    };

    console.log("clienteData:", clienteData);
    console.log("body que se envía a PendingSales:", body);

    try {
      const res = await fetch(`${BASE_API_URL}/api/PendingSales`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...tenantHeaders(effectiveTenantSlug) },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Respuesta error:", errorText);
        throw new Error("Error al registrar el pedido");
      }

      const data = await res.json();

      setVentaConfirmada(true);
      setPedidoInfo({
        trackingCode: data.trackingCode,
        status: data.status,
        total: data.total,
        date: data.date,
      });

      setCarrito([]);
      setClienteData(null);
    } catch (err) {
      console.error("Error en handleConfirm:", err);
      alert("Error al enviar el pedido");
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    if (!clienteData || carrito.length === 0) return;

    const lineas = carrito
      .map(
        (item) =>
          `- ${item.cantidad} x ${item.nombre} ($${(
            item.precio * item.cantidad
          ).toLocaleString()})`
      )
      .join("\n");

    const mensaje = `
Hola, soy ${clienteData.client}.
Quiero hacer este pedido:

${lineas}

Total: $${total.toLocaleString()}
Dirección: ${clienteData.address || ""}
Teléfono: ${clienteData.phone || ""}
`;

    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
      mensaje
    )}`;

    window.open(url, "_blank");
  };

  const disabledConfirm = !clienteData || carrito.length === 0 || loading;
  const isLogged = Boolean(sessionStorage.getItem("user"));
  const missingTenant = !effectiveTenantSlug;

  return (
    <div className="pedido-wrapper">
      <div className="pedido-container container-lg">
        <header className="pedido-header d-flex justify-content-between align-items-center">
          <div>
            <h1 className="pedido-title">🛍 Pedido público</h1>
            <p className="pedido-subtitle">
              Selecciona productos, completa tus datos y confirma tu pedido.
            </p>
          </div>

          <div className="mt-3 p-3 border rounded bg-light">
            <h5>🔎 Consultar estado de un pedido</h5>
            <p className="small text-muted">
              Puedes buscar por código de seguimiento o número de teléfono.
            </p>

            <div className="d-flex gap-2 flex-wrap">
              <input
                type="text"
                className="form-control"
                placeholder="Código de seguimiento"
                id="trackCodeInput"
              />
              <input
                type="text"
                className="form-control"
                placeholder="Número de teléfono"
                id="phoneInput"
              />

              <button
                className="btn btn-primary"
                onClick={() => {
                  const code = document
                    .getElementById("trackCodeInput")
                    .value.trim();
                  const phone = document
                    .getElementById("phoneInput")
                    .value.trim();

                  if (!code && !phone) {
                    alert("Ingresa un código o un teléfono.");
                    return;
                  }

                  if (code) {
                    window.location.href = effectiveTenantSlug
                      ? `/seguimiento/${effectiveTenantSlug}/${code}`
                      : `/seguimiento/${code}`;
                  } else {
                    window.location.href = effectiveTenantSlug
                      ? `/seguimiento/${effectiveTenantSlug}/telefono/${phone}`
                      : `/seguimiento/telefono/${phone}`;
                  }
                }}
              >
                Buscar
              </button>
            </div>
          </div>

          {!isLogged && (
            <div className="header-actions">
              <Link to="/login" className="btn btn-outline-primary btn-admin">
                🛡 Iniciar sesión
              </Link>
            </div>
          )}
        </header>

        {ventaConfirmada && pedidoInfo && (
          <div
            className="alert alert-success mb-3 text-center"
            role="status"
            aria-live="polite"
          >
            <p className="mb-1">¡Gracias por tu pedido! 🎉</p>

            <p className="mb-0">
              Tu código de seguimiento es{" "}
              <strong>{pedidoInfo.trackingCode}</strong>
            </p>

            <p className="mb-0">
              Estado actual: <strong>{pedidoInfo.status}</strong>
            </p>

            <p className="mb-1 small text-muted">
              Guarda este código para consultar el estado más tarde.
            </p>

            <Link
              to={
                effectiveTenantSlug
                  ? `/seguimiento/${effectiveTenantSlug}/${pedidoInfo.trackingCode}`
                  : `/seguimiento/${pedidoInfo.trackingCode}`
              }
              className="btn btn-primary mt-2"
            >
              🔎 Ver estado de mi pedido
            </Link>
          </div>
        )}

        <div className="row g-3">
          <section className="col-12 col-lg-8">
            <div className="panel card-shadow">
              <h2 className="panel-title">🗂 Categorías & Productos</h2>
              {missingTenant ? (
                <div className="alert alert-warning mb-0">
                  Para ver productos, abre el pedido publico con el
                  identificador del negocio. Ejemplo:{" "}
                  <strong>/publico/mi-tienda</strong>
                </div>
              ) : (
                <CategoriaSelector
                  carrito={carrito}
                  setCarrito={setCarrito}
                  tenantSlug={effectiveTenantSlug}
                />
              )}
            </div>
          </section>

          <aside className="col-12 col-lg-4">
            <div className="panel card-shadow">
              <h2 className="panel-title">🛒 Resumen</h2>

              {carrito.length === 0 ? (
                <p className="text-muted small mb-0">
                  Tu carrito está vacío. Agrega productos para ver el resumen.
                </p>
              ) : (
                <div className="carrito-resumen" aria-live="polite">
                  <ul className="list-group list-group-flush mb-3">
                    {carrito.map((item) => (
                      <li
                        key={item.id}
                        className="list-group-item d-flex justify-content-between align-items-center gap-2"
                      >
                        <div className="flex-grow-1 d-flex flex-column">
                          <span className="fw-medium">{item.nombre}</span>
                          <span className="small text-muted">
                            Unit: ${item.precio.toLocaleString()}
                          </span>
                        </div>

                        <div
                          className="qty-group"
                          role="group"
                          aria-label={`Cantidad para ${item.nombre}`}
                        >
                          <button
                            type="button"
                            className="btn btn-qty"
                            aria-label={`Disminuir ${item.nombre}`}
                            onClick={() => decrementar(item.id)}
                            disabled={item.cantidad <= 1}
                            title={
                              item.cantidad <= 1
                                ? "Cantidad mínima"
                                : "Disminuir"
                            }
                          >
                            –
                          </button>
                          <output className="qty-value" aria-live="polite">
                            {item.cantidad}
                          </output>
                          <button
                            type="button"
                            className="btn btn-qty"
                            aria-label={`Aumentar ${item.nombre}`}
                            onClick={() => incrementar(item.id)}
                            disabled={item.cantidad >= item.stock}
                            title="Aumentar"
                          >
                            +
                          </button>
                        </div>

                        <span className="fw-semibold precio-item">
                          ${(item.precio * item.cantidad).toLocaleString()}
                        </span>

                        <button
                          type="button"
                          className="btn btn-link btn-trash"
                          aria-label={`Eliminar ${item.nombre} del carrito`}
                          onClick={() => eliminar(item.id)}
                          title="Eliminar"
                        >
                          🗑
                        </button>
                      </li>
                    ))}

                    <li className="list-group-item d-flex justify-content-between align-items-center total-row">
                      <div className="text-muted small">
                        {itemsCount} ítem(s)
                      </div>
                      <strong aria-label={`Total ${total.toLocaleString()}`}>
                        Total: ${total.toLocaleString()}
                      </strong>
                    </li>
                  </ul>

                  <button
                    type="button"
                    className="btn btn-primary w-100 btn-lg"
                    onClick={handleConfirm}
                    disabled={disabledConfirm}
                  >
                    {loading ? "Procesando…" : "Confirmar pedido"}
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-success w-100 mt-2"
                    onClick={handleWhatsApp}
                    disabled={!clienteData || carrito.length === 0}
                  >
                    Enviar resumen por WhatsApp
                  </button>
                </div>
              )}
            </div>
          </aside>
        </div>

        <div className="panel card-shadow mt-3">
          <h2 className="panel-title">👤 Datos del cliente</h2>
          <VentaForm onConfirm={setClienteData} />
        </div>
      </div>

      {/* Sticky CTA (móvil) */}
      <div className="sticky-cta d-lg-none">
        <div className="sticky-cta-inner">
          {!isLogged && (
            <Link
              to="/login"
              className="btn btn-outline-primary btn-sm btn-admin-cta"
            >
              Admin
            </Link>
          )}

          <div className="sticky-cta-total">
            <span>Total ({itemsCount})</span>
            <strong>${total.toLocaleString()}</strong>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-lg flex-grow-1"
            onClick={handleConfirm}
            disabled={disabledConfirm}
          >
            {loading ? "Procesando…" : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PedidoPublico;
