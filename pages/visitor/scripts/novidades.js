import { api } from "../../../assets/apiHelper.js";
import { API_URL } from "../../../assets/config.js";
import { initApiUrl } from '../../../assets/config.js';

function initSlider(track, dotsContainer, prevBtn, nextBtn, type) {
  let index = 0;
  const slides = track.children;
  const total = slides.length;

  dotsContainer.innerHTML = "";

  for (let i = 0; i < total; i++) {
    const dot = document.createElement("button");
    if (i === 0) dot.classList.add("active");

    dot.onclick = () => {
      index = i;
      update();
    };

    dotsContainer.appendChild(dot);
  }

  function update() {
    track.style.transform = `translateX(-${index * 100}vw)`;

    [...dotsContainer.children].forEach((d, i) =>
      d.classList.toggle("active", i === index)
    );
  }

  prevBtn.onclick = () => {
    index = index > 0 ? index - 1 : total - 1;
    update();
  };

  nextBtn.onclick = () => {
    index = index < total - 1 ? index + 1 : 0;
    update();
  };
}

/* ===== EVENTOS ===== */
async function renderEvents() {
  const res = await api("events/published");
  const events = res?.data || [];

  const track = document.querySelector(".events-track");
  const dots = document.querySelector(".events-dots");

  for (const event of events) {
    const card = document.createElement("div");
    card.className = "novidade-card";

    card.onclick = () => {
      window.location.href = `eventos-details.html?id=${event.id}`;
    };

    if (event.hasFile) {
      card.style.backgroundImage = `url(${API_URL}/events/${event.id}/file)`;
    }

    const title = document.createElement("span");
    title.textContent = event.title;

    card.appendChild(title);
    track.appendChild(card);
  }

  initSlider(
    track,
    dots,
    document.querySelector(".events-prev"),
    document.querySelector(".events-next"),
    "events"
  );
}

/* ===== NOTÍCIAS ===== */
async function renderNews() {
  const res = await api("news/published");
  const news = res?.data || [];

  const track = document.querySelector(".news-track");
  const dots = document.querySelector(".news-dots");

  for (const item of news) {
    const card = document.createElement("div");
    card.className = "novidade-card";

    card.onclick = () => {
      window.location.href = `news-details.html?id=${item.id}`;
    };


    if (item.hasFile) {
      card.style.backgroundImage = `url(${API_URL}/news/${item.id}/file)`;
    }

    const title = document.createElement("span");
    title.textContent = item.title;

    card.appendChild(title);
    track.appendChild(card);
  }

  initSlider(
    track,
    dots,
    document.querySelector(".news-prev"),
    document.querySelector(".news-next"),
    "news"
  );
}

document.addEventListener("DOMContentLoaded", async () => {
  await initApiUrl();
  renderEvents();
  renderNews();
});
