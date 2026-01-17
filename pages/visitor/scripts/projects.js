import { api } from "../../../assets/apiHelper.js";
import { BASE_PATH } from "../../../assets/config.js";
import { renderMarkdown } from "../../../assets/markdown.js";

export async function renderProjects() {
    const res = await api("projects/published");
    const projects = res?.data || [];

    const grid = document.getElementById("projects-grid");
    if (!grid) return;

    grid.innerHTML = "";

    for (const project of projects) {
        const card = document.createElement("div");
        card.classList.add("project-card");

        const title = document.createElement("span");
        title.textContent = project.title; // Correctly using project.title here
        card.appendChild(title);

        /* imagem do projeto */
        if (project.hasFile) {
            const imgRes = await api(`projects/${project.id}/file`);
            if (imgRes?.ok && imgRes.data) {
                const imgUrl = URL.createObjectURL(imgRes.data);
                card.style.backgroundImage = `url(${imgUrl})`;
            }
        }

        /* clique → detalhes */
        card.addEventListener("click", () => {
            window.location.href =
                `${BASE_PATH}/pages/visitor/projeto-details.html?id=${project.id}`;
        });

        grid.appendChild(card);
    }
}
