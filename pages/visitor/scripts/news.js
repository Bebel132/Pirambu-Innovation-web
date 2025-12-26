import { api } from "../../../assets/apiHelper.js";

export async function renderNewsList() {
    const response = await api("news/published");
    const news = response?.data || [];

    const newsListContainer = document.querySelector(".news-list");
    if (!newsListContainer) return;

    // Limpa container (segurança)
    newsListContainer.innerHTML = "";

    for (const course of news) {
        const item = document.createElement("li");
        item.classList.add("news_list-item", "item");

        // Título
        const titleSpan = document.createElement("span");
        titleSpan.textContent = course.title;
        item.appendChild(titleSpan);

        // Imagem do noticia (se existir)
        if (course.hasFile) {
            const res = await api(`news/${course.id}/file`);
            if (res?.ok && res.data) {
                const blobUrl = URL.createObjectURL(res.data);
                item.style.backgroundImage = `url(${blobUrl})`;
            }
        } else {
            item.style.backgroundColor = "var(--color-gray)";
        }

        // Clique → página do noticia
        item.addEventListener("click", () => {
            const url = new URL('/pages/visitor/noticia.html', window.location.origin);
            url.searchParams.set('id', course.id);
            window.location.href = url.toString();
        });

        newsListContainer.appendChild(item);
    }
}