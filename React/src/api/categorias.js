import { BASE_API_URL, tenantHeaders } from "./baseurl";

const API_URL = `${BASE_API_URL}/api/categories`;

export const getcategories = async (tenantSlug) => {
  const token = sessionStorage.getItem("token");
  const res = await fetch(API_URL, {
    headers: {
      "Content-Type": "application/json",
      ...tenantHeaders(tenantSlug),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return res.json();
};
export const createcategories = async (category) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
    body: JSON.stringify(category),
  });
  return res.json();
};

export const updatecategories = async (id, category) => {
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
    body: JSON.stringify(category),
  });
};

export const deletecategories = async (id) => {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
};
