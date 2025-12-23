import { api } from "../../../../../assets/apiHelper.js";

export async function listNewss() {
  return api("news/");
}

export async function getNewsFile(courseId) {
  return api(`news/${courseId}/file`);
}

export async function createNews(payload) {
  return api("news/", { method: "POST", data: payload });
}

export async function updateNews(courseId, payload) {
  return api(`news/${courseId}`, { method: "PUT", data: payload });
}

export async function uploadNewsFile(courseId, file) {
  const fd = new FormData();
  fd.append("file", file);

  return api(`news/${courseId}/upload`, {
    method: "POST",
    body: fd,
  });
}

export async function deactivateNews(courseId) {
  return api(`news/deactivate/${courseId}`, { method: "POST" });
}

export async function publishNews(courseId) {
  return api(`news/publish/${courseId}`, { method: "POST" });
}