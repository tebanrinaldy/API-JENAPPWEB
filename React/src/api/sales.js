import { BASE_API_URL } from "./baseurl";

const API_URL = `${BASE_API_URL}/api/sales`;

function authHeaders() {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Tu sesion vencio. Inicia sesion nuevamente.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export const getSales = async () => {
  const res = await fetch(API_URL, {
    headers: authHeaders(),
  });
  if (res.status === 401) {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    throw new Error("Tu sesion vencio. Inicia sesion nuevamente.");
  }
  if (!res.ok) throw new Error("Error al obtener las ventas");
  return res.json();
};

export const createSale = async (sale) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(sale),
  });

  const text = await res.text();

  if (res.status === 401) {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    throw new Error("Tu sesion vencio. Inicia sesion nuevamente.");
  }

  if (!res.ok) {
    console.error("Error al crear la venta. Respuesta del servidor:");
    console.error(text);
    throw new Error(text || "Error al crear la venta");
  }

  return text ? JSON.parse(text) : null;
};
