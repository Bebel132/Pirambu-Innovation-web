import { api } from "../../../assets/apiHelper.js";
import { renderMarkdown } from "../../../assets/markdown.js";
import { BASE_PATH } from "../../../assets/config.js";

/* =====================================================
   SLIDER DE NOTÍCIAS (HOME)
===================================================== */
export async function renderNewsList() {
  const track = document.getElementById("newsTrack");
  const dotsContainer = document.getElementById("newsDots");
  const prev = document.getElementById("newsPrev");
  const next = document.getElementById("newsNext");

  if (!track) return;

  const response = await api("news/published");
  const news = response?.data || [];

  track.innerHTML = "";
  dotsContainer.innerHTML = "";

  if (!news.length) return;

  for (const item of news) {
    const slide = document.createElement("li");
    slide.classList.add("news-slide");

    const title = document.createElement("span");
    title.textContent = item.title;
    slide.appendChild(title);

    if (item.hasFile) {
      try {
        const res = await api(`news/${item.id}/file`);
        if (res?.ok && res.data) {
          slide.style.backgroundImage = `url("${URL.createObjectURL(res.data)}")`;
        }
      } catch {
        console.warn("Imagem da notícia não carregada:", item.id);
      }
    }

    slide.addEventListener("click", () => {
      window.location.href =
        `${BASE_PATH}/pages/visitor/news-details.html?id=${item.id}`;
    });

    track.appendChild(slide);

    const dot = document.createElement("button");
    dotsContainer.appendChild(dot);
  }

  /* ===== SLIDER ===== */
  const slides = track.querySelectorAll(".news-slide");
  const dots = dotsContainer.querySelectorAll("button");
  let index = 0;

  function slideWidth() {
    return slides[0].offsetWidth + 16;
  }

  function update() {
    track.style.transform = `translateX(${-index * slideWidth()}px)`;
    dots.forEach(d => d.classList.remove("active"));
    dots[index].classList.add("active");

    if (prev) prev.disabled = index === 0;
    if (next) next.disabled = index === slides.length - 1;
  }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      index = i;
      update();
    });
  });

  if (prev) {
    prev.addEventListener("click", () => {
      if (index > 0) {
        index--;
        update();
      }
    });
  }

  if (next) {
    next.addEventListener("click", () => {
      if (index < slides.length - 1) {
        index++;
        update();
      }
    });
  }

  dots[0]?.classList.add("active");
  update();
}

/* =====================================================
   LISTA DE NOTÍCIAS (noticias.html)
===================================================== */
export async function renderNewsPage() {
  const container = document.getElementById("newsList");
  if (!container) return;

  const response = await api("news/published");
  const news = response?.data || [];

  container.innerHTML = "";

  for (const item of news) {
    const card = document.createElement("article");
    card.classList.add("news-card");

    let imageUrl = "";

    if (item.hasFile) {
      try {
        const res = await api(`news/${item.id}/file`);
        if (res?.ok && res.data) {
          imageUrl = URL.createObjectURL(res.data);
        }
      } catch {
        console.warn("Imagem da notícia não carregada:", item.id);
      }
    }

   card.innerHTML = `
  ${imageUrl ? `<img src="${imageUrl}" alt="${item.title}">` : ""}
  <div class="news-card-content">
    <h2>${item.title}</h2>

    <div class="news-description clamp-4">
      ${renderMarkdown(item.description ?? "")}
    </div>

    <span class="news-read-more">Saiba mais</span>
  </div>
`;

    card.addEventListener("click", () => {
      window.location.href =
        `${BASE_PATH}/pages/visitor/news-details.html?id=${item.id}`;
    });

    container.appendChild(card);
  }
}
