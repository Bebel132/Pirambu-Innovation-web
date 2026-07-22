import { api } from "../../../assets/apiHelper.js";
import { renderMarkdown } from "../../../assets/markdown.js";
import { API_URL } from "../../../assets/config.js";

export async function renderEventsList() {
  const eventsListContainer = document.querySelector(".events-list");
  if (!eventsListContainer) return;

  const response = await api("events/published");
  const events = response?.data || [];

  eventsListContainer.innerHTML = "";

  for (const event of events) {
    const item = document.createElement("li");
    item.classList.add("home-card");

    let imageUrl = "";

    if (event.hasFile) {
      try {
        imageUrl = `${API_URL}/events/${event.id}/file`;
      } catch {
        console.warn(`Imagem não carregada (evento ${event.id})`);
      }
    }

    item.innerHTML = `
      ${imageUrl ? `<img src="${imageUrl}" alt="${event.title}">` : ""}
      <div class="home-card-content">
        <h2>${event.title || ""}</h2>

        <div class="home-card-description clamp-4">
          ${renderMarkdown(event.description ?? "")}
        </div>

        <span class="home-card-read-more">Saiba mais</span>
      </div>
    `;

    item.onclick = () => {
      window.location.href =
        `pages/visitor/eventos-details.html?id=${event.id}`;
    };

    eventsListContainer.appendChild(item);
  }
}
