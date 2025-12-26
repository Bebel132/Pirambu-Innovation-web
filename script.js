import { api } from './assets/apiHelper.js';
import { renderCoursesList } from './pages/visitor/scripts/courses.js';
import { renderEventsList } from './pages/visitor/scripts/events.js';
import { renderNewsList } from './pages/visitor/scripts/news.js';

async function initHome() {
    // Loading inicial
    await api("teste");
    const loading = document.querySelector(".loader");
    if (loading) loading.style.display = "none";

    renderCoursesList();
    renderEventsList();
    renderNewsList();
}

export { initHome };
