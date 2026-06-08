function VentaList({ ventas, onVerTicket }) {
  if (!ventas || ventas.length === 0) {
    return (
      <div className="venta-empty">
        <strong>No hay ventas registradas.</strong>
        <span>Cuando registres ventas aparecerán en este historial.</span>
      </div>
    );
  }

  const ventasOrdenadas = [...ventas].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="venta-list">
      {ventasOrdenadas.map((venta) => {
        const fecha = new Date(venta.date);
        const fechaFormateada = fecha.toLocaleString("es-CO");
        const total = Number(venta.total || 0);

        return (
          <article key={venta.id} className="venta-card">
            <header className="venta-card-header">
              <div className="venta-card-heading">
                <span className="venta-id">Venta #{venta.id}</span>
                <h3>{venta.client || "Cliente sin nombre"}</h3>
                <time>{fechaFormateada}</time>
              </div>

              <div className="venta-total-box">
                <span>Total</span>
                <strong>${total.toLocaleString()}</strong>
              </div>
            </header>

            <div className="venta-card-body">
              <div className="venta-meta-grid">
                <div className="venta-meta-item">
                  <span>Correo</span>
                  <strong>{venta.email || "Sin correo"}</strong>
                </div>
                <div className="venta-meta-item">
                  <span>Teléfono</span>
                  <strong>{venta.phone || "Opcional"}</strong>
                </div>
                <div className="venta-meta-item">
                  <span>Dirección</span>
                  <strong>{venta.address || "Opcional"}</strong>
                </div>
                <div className="venta-meta-item">
                  <span>Pago</span>
                  <strong>{venta.paymentMethod || "Sin especificar"}</strong>
                </div>
              </div>

              {venta.details && venta.details.length > 0 && (
                <div className="table-responsive venta-table-wrap">
                  <table className="table table-sm venta-table mb-0">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Cant.</th>
                        <th>Precio</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {venta.details.map((d) => (
                        <tr key={d.id}>
                          <td>{d.product?.name ?? `Prod ${d.productId}`}</td>
                          <td>{d.quantity}</td>
                          <td>${d.unitPrice.toLocaleString()}</td>
                          <td>${d.totalPrice.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {onVerTicket && (
                <div className="venta-card-actions">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm venta-ticket-btn"
                    onClick={() => onVerTicket(venta)}
                  >
                    Ticket PDF
                  </button>
                </div>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default VentaList;
