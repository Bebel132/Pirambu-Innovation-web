import { api } from "../../../../../assets/apiHelper.js";

export async function listEvents() {
  return api("events/");
}

export async function getEventsFile(eventId) {
  return api(`events/${eventId}/file`);
}

export async function createEvents(payload) {
  return api("events/", { method: "POST", data: payload });
}

export async function updateEvents(eventId, payload) {
  return api(`events/${eventId}`, { method: "PUT", data: payload });
}

export async function uploadEventsFile(eventId, file) {
  const fd = new FormData();
  fd.append("file", file);

  return api(`events/${eventId}/upload`, {
    method: "POST",
    body: fd,
  });
}

export async function deactivateEvents(eventId) {
  return api(`events/deactivate/${eventId}`, { method: "POST" });
}

export async function publishEvents(eventId) {
  return api(`events/publish/${eventId}`, { method: "POST" });
}