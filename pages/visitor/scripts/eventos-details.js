import { api } from "../../../assets/apiHelper.js";
import { renderMarkdown } from "../../../assets/markdown.js";
import { API_URL } from "../../../assets/config.js";

async function loadEventDetails() {
  const params = new URLSearchParams(window.location.search);
  const eventId = params.get("id");

  if (!eventId) return;

  const response = await api(`events/${eventId}`);
  if (!response?.ok) return;

  const event = response.data;

  // ELEMENTOS
  const titleEl = document.getElementById("eventTitle");
  const imageEl = document.getElementById("eventImage");
  const contentEl = document.getElementById("eventContent");

  // TÍTULO
  if (titleEl) {
    titleEl.textContent = event.title || "";
  }

  // TEXTO
  if (contentEl) {
    const text = event.content || event.description || "";
    contentEl.innerHTML = renderMarkdown(text);
  }

  // IMAGEM
  if (event.hasFile && imageEl) {
    imageEl.src = `${API_URL}/events/${event.id}/file`;
  }
}

document.addEventListener("DOMContentLoaded", loadEventDetails);
