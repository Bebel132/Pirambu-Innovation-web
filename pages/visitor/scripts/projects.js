import { api } from "../../../assets/apiHelper.js";
import { BASE_PATH, API_URL } from "../../../assets/config.js";
import { renderMarkdown } from "../../../assets/markdown.js";

export async function renderProjects() {
  let projects = [];

  try {
    const res = await api("projects/published");
    projects = res?.data || [];
  } catch (err) {
    console.error("Erro ao buscar projetos:", err);
    return;
  }

  const grid = document.getElementById("projects-grid");
  if (!grid) return;

  grid.innerHTML = "";

  for (const project of projects) {
    const card = document.createElement("div");
    card.classList.add("home-card");

    /* imagem */
    const img = document.createElement("img");
    img.alt = project.title || "";
    img.src = `${API_URL}/projects/${project.id}/file`;

    if (project.hasFile && project.id) {
      img.src = `${API_URL}/projects/${project.id}/file`;
    }

    /* conteúdo */
    const content = document.createElement("div");
    content.classList.add("home-card-content");

    const title = document.createElement("h2");
    title.textContent = project.title || "";

    const description = document.createElement("div");
    description.classList.add("home-card-description", "clamp-4");
    description.innerHTML = renderMarkdown(project.description || "");

    const readMore = document.createElement("span");
    readMore.classList.add("home-card-read-more");
    readMore.textContent = "Saiba mais";

    content.appendChild(title);
    content.appendChild(description);
    content.appendChild(readMore);

    card.appendChild(img);
    card.appendChild(content);

    card.addEventListener("click", () => {
      window.location.href =
        `${BASE_PATH}/pages/visitor/projeto-details.html?id=${project.id}`;
    });

    grid.appendChild(card);
  }
}
