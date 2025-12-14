import { api } from './assets/apiHelper.js';

async function initHome() {
    // Loading inicial
    await api("teste");
    const loading = document.querySelector(".loader");
    if (loading) loading.style.display = "none";

    // Busca cursos publicados
    const response = await api("courses/published");
    const courses = response?.data || [];

    const coursesListContainer = document.querySelector(".courses-list");
    if (!coursesListContainer) return;

    // Limpa container (segurança)
    coursesListContainer.innerHTML = "";

    for (const course of courses) {
        const item = document.createElement("li");
        item.classList.add("courses_list-item", "item");

        // Título
        const titleSpan = document.createElement("span");
        titleSpan.textContent = course.title;
        item.appendChild(titleSpan);

        // Imagem do curso (se existir)
        if (course.hasFile) {
            const res = await api(`courses/${course.id}/file`);
            if (res?.ok && res.data) {
                const blobUrl = URL.createObjectURL(res.data);
                item.style.backgroundImage = `url(${blobUrl})`;
            }
        } else {
            item.style.backgroundColor = "var(--color-gray)";
        }

        // Clique → página do curso
        item.addEventListener("click", () => {
            const url = new URL('/pages/visitor/course.html', window.location.origin);
            url.searchParams.set('id', course.id);
            window.location.href = url.toString();
        });

        coursesListContainer.appendChild(item);
    }
}

export { initHome };
