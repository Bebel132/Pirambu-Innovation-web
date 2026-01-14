/* ================= IMPORTS ================= */
import { api } from './assets/apiHelper.js';
import { renderCoursesList } from './pages/visitor/scripts/courses.js';
import { renderEventsList } from './pages/visitor/scripts/events.js';
import { renderNewsList } from './pages/visitor/scripts/news.js';
import { renderAboutUs } from './pages/visitor/scripts/aboutUs.js';

/* ================= HOME INITIALIZATION ================= */
async function initHome() {
    await api("teste");

    const loading = document.querySelector(".loader");
    if (loading) loading.style.display = "none";

    renderCoursesList();
    renderEventsList();
    renderNewsList();

    // ⚠️ Aguarda as notícias renderizarem antes de iniciar o slider
    setTimeout(initNewsSlider, 100);

    renderAboutUs();
}

/* ================= NEWS SLIDER ================= */
function initNewsSlider() {
    const track = document.getElementById("newsTrack");
    const slides = document.querySelectorAll(".news-slide");
    const dotsContainer = document.getElementById("newsDots");
    const prev = document.getElementById("prevNews");
    const next = document.getElementById("nextNews");

    if (!track || !slides.length) return;

    let index = 0;
    const slideWidth = slides[0].offsetWidth + 15;

    /* ---------- Dots ---------- */
    dotsContainer.innerHTML = "";

    slides.forEach((_, i) => {
        const dot = document.createElement("button");
        if (i === 0) dot.classList.add("active");

        dot.addEventListener("click", () => {
            index = i;
            update();
        });

        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll("button");

    /* ---------- Update ---------- */
    function update() {
        track.style.transform = `translateX(${-index * slideWidth}px)`;

        dots.forEach(d => d.classList.remove("active"));
        dots[index].classList.add("active");

        prev.disabled = index === 0;
        next.disabled = index === slides.length - 1;
    }

    /* ---------- Arrows ---------- */
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

    update();
}

/* ================= EVENT LISTENERS ================= */
document.addEventListener("DOMContentLoaded", () => {
    // O slider é inicializado após renderNewsList via initHome
});

/* ================= EXPORTS ================= */
export { initHome };
