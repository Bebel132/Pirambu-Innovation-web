import { api } from "../../../assets/apiHelper.js";

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

  /* ===== CRIA SLIDES ===== */
  for (const item of news) {
    const slide = document.createElement("li");
    slide.classList.add("news-slide");

    const title = document.createElement("span");
    title.textContent = item.title;
    slide.appendChild(title);

    if (item.hasFile) {
      const res = await api(`news/${item.id}/file`);
      if (res?.ok && res.data) {
        slide.style.backgroundImage = `url(${URL.createObjectURL(res.data)})`;
      }
    }

    slide.addEventListener("click", () => {
      const url = new URL("/pages/visitor/noticia.html", window.location.origin);
      url.searchParams.set("id", item.id);
      window.location.href = url.toString();
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

    prev.disabled = index === 0;
    next.disabled = index === slides.length - 1;
  }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      index = i;
      update();
    });
  });

  prev.addEventListener("click", () => {
    if (index > 0) {
      index--;
      update();
    }
  });

  next.addEventListener("click", () => {
    if (index < slides.length - 1) {
      index++;
      update();
    }
  });

  dots[0].classList.add("active");
  update();
}
