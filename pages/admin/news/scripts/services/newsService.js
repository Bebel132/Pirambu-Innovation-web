import { api } from "../../../../../assets/apiHelper.js";

export async function listNewss() {
  return api("news/");
}

export async function getNewsFile(newsId) {
  return api(`news/${newsId}/file`);
}

export async function createNews(payload) {
  return api("news/", { method: "POST", data: payload });
}

export async function updateNews(newsId, payload) {
  return api(`news/${newsId}`, { method: "PUT", data: payload });
}

export async function uploadNewsFile(newsId, file) {
  const fd = new FormData();
  fd.append("file", file);

  return api(`news/${newsId}/upload`, {
    method: "POST",
    body: fd,
  });
}

export async function deactivateNews(newsId) {
  return api(`news/deactivate/${newsId}`, { method: "POST" });
}

export async function publishNews(newsId) {
  return api(`news/publish/${newsId}`, { method: "POST" });
}