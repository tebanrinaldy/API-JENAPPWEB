const configuredApiUrl = import.meta.env.VITE_API_URL;

export const BASE_API_URL = (configuredApiUrl || "https://api-jenappweb.onrender.com").replace(/\/$/, "");

export function getStoredTenantSlug() {
  try {
    const user = JSON.parse(sessionStorage.getItem("user") || "null");
    return user?.tenantSlug || "";
  } catch {
    return "";
  }
}

export function tenantHeaders(tenantSlug) {
  const slug = tenantSlug || getStoredTenantSlug();
  return slug ? { "X-Tenant-Slug": slug } : {};
}
