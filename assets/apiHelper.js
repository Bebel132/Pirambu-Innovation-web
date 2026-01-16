import { API_URL } from "./config.js";

export async function api(
  endpoint,
  { method = "GET", data = null, params = null, headers = {}, ...customConfig } = {}
) {
  const loading = document.querySelector(".loader");
  if (loading) loading.style.display = "flex";

  const config = {
    method,
    credentials: "include",
    headers: {
      ...headers
    },
    ...customConfig
  };

  // Monta URL corretamente
  let url = `${API_URL.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`;

  if (params) {
    const qs = new URLSearchParams(params).toString();
    url += "?" + qs;
  }

  // Body (JSON ou FormData)
  if (data) {
    if (data instanceof FormData) {
      config.body = data;
    } else {
      config.headers["Content-Type"] = "application/json";
      config.body = JSON.stringify(data);
    }
  }

  try {
    const response = await fetch(url, config);

    // Redireciona se não autorizado (admin)
    if (response.status === 401 && window.location.href.includes("pages/admin")) {
      window.location.href = "/pages/admin";
      return;
    }

    const contentType = response.headers.get("Content-Type") || "";
    let parsed;

    if (
      contentType.includes("image") ||
      contentType.includes("application/octet-stream")
    ) {
      parsed = await response.blob();
    } else if (contentType.includes("application/json")) {
      parsed = await response.json();
    } else {
      parsed = await response.text();
    }

    return {
      ok: response.ok,
      status: response.status,
      data: parsed
    };

  } catch (error) {
    return {
      ok: false,
      status: 0,
      data: { error: "Network error", details: error.message }
    };
  } finally {
    if (loading) loading.style.display = "none";
  }
}
