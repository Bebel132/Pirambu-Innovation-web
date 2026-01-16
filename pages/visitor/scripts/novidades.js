import { api } from "../../../assets/apiHelper.js";

/* EVENTOS */
async function renderEvents() {
  const res = await api("events/published");
  const events = res?.data || [];
  const track = document.querySelector(".events-track");

  for (const event of events) {
    const card = document.createElement("div");
    card.className = "novidade-card";

    if (event.hasFile) {
      const img = await api(`events/${event.id}/file`);
      if (img?.ok) {
        card.style.backgroundImage = `url(${URL.createObjectURL(img.data)})`;
      }
    }

    const title = document.createElement("span");
    title.textContent = event.title;

    card.appendChild(title);
    track.appendChild(card);
  }
}

/* NOTÍCIAS */
async function renderNews() {
  const res = await api("news/published");
  const news = res?.data || [];
  const track = document.querySelector(".news-track");

  for (const item of news) {
    const card = document.createElement("div");
    card.className = "novidade-card";

    if (item.hasFile) {
      const img = await api(`news/${item.id}/file`);
      if (img?.ok) {
        card.style.backgroundImage = `url(${URL.createObjectURL(img.data)})`;
      }
    }

    const title = document.createElement("span");
    title.textContent = item.title;

    card.appendChild(title);
    track.appendChild(card);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderEvents();
  renderNews();
});
