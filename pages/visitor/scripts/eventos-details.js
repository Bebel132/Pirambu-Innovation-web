import { api } from "../../../assets/apiHelper.js";
import { renderMarkdown } from "../../../assets/markdown.js";

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
    const imgRes = await api(`events/${event.id}/file`);
    if (imgRes?.ok && imgRes.data) {
      imageEl.src = URL.createObjectURL(imgRes.data);
    }
  }
}

document.addEventListener("DOMContentLoaded", loadEventDetails);
