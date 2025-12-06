import { API_URL } from "./config.js";

export async function api(
  endpoint,
  { method = "GET", data = null, params = null, headers = {}, ...customConfig } = {}
) {
  document.querySelector(".loading").style.display = "flex"
  const config = {
    method,
    credentials: "include",
    headers: {
      ...headers
    },
    ...customConfig
  };

  // Monta URL
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

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        data: parsed
      };
    }

    document.querySelector(".loading").style.display = "none"

    return {
      ok: true,
      status: response.status,
      data: parsed
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      data: { error: "Network error", details: error.message }
    };
  }
}
