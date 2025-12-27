import { api } from "../../../../../assets/apiHelper.js";

export async function listProjects() {
  return api("projects/");
}

export async function getProjectsFile(eventId) {
  return api(`projects/${eventId}/file`);
}

export async function createProjects(payload) {
  return api("projects/", { method: "POST", data: payload });
}

export async function updateProjects(eventId, payload) {
  return api(`projects/${eventId}`, { method: "PUT", data: payload });
}

export async function uploadProjectsFile(eventId, file) {
  const fd = new FormData();
  fd.append("file", file);

  return api(`projects/${eventId}/upload`, {
    method: "POST",
    body: fd,
  });
}

export async function deactivateProjects(eventId) {
  return api(`projects/deactivate/${eventId}`, { method: "POST" });
}

export async function publishProjects(eventId) {
  return api(`projects/publish/${eventId}`, { method: "POST" });
}