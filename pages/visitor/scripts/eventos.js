import { api } from "../../../assets/apiHelper.js";
import { API_URL } from "../../../assets/config.js";
import { initApiUrl } from './assets/config.js';

export async function renderEventsPage() {
  await initApiUrl();
  const container = document.getElementById("eventsList");
  if (!container) return;

  const response = await api("events/published");

  if (!response.ok) {
    container.innerHTML = `
      <p style="font-size: 14px; color: #666;">
        Não foi possível carregar os eventos no momento.
      </p>
    `;
    return;
  }

  const events = response.data || [];
  container.innerHTML = "";

  for (const event of events) {
    let imageUrl = "";

    if (event.hasFile) {
      imageUrl = `${API_URL}/events/${event.id}/file`;
    }

    const card = document.createElement("article");
    card.classList.add("event-card");

    card.innerHTML = `
      <div class="event-image"
        style="${imageUrl ? `background-image:url('${imageUrl}')` : ""}">
      </div>

      <div class="event-content">
        <h3>${event.title}</h3>
        <p>${event.description ?? ""}</p>
      </div>
    `;
    
    card.addEventListener("click", () => {
      window.location.href = `./eventos-details.html?id=${event.id}`;
    });

    container.appendChild(card);
  }
}

renderEventsPage();
