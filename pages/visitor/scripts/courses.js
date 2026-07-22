import { api } from "../../../assets/apiHelper.js";
import { BASE_PATH, API_URL } from "../../../assets/config.js";
import { renderMarkdown } from "../../../assets/markdown.js";

export async function renderCoursesList() {
  const coursesListContainer = document.querySelector(".courses-list");
  if (!coursesListContainer) return;

  coursesListContainer.innerHTML = "";

  let courses = [];

  try {
    const response = await api("courses/published");
    courses = response?.data || [];
  } catch (err) {
    console.error("Erro ao buscar cursos:", err);
    return;
  }

  for (const course of courses) {
    const item = document.createElement("li");
    item.classList.add("home-card");

    let imageUrl = "";

    // imagem do curso
    if (course.hasFile && course.id) {
      try {
        imageUrl = `${API_URL}/courses/${course.id}/file`;
      } catch {
        console.warn(`Imagem não carregada (curso ${course.id})`);
      }
    }

    item.innerHTML = `
      ${imageUrl ? `<img src="${imageUrl}" alt="${course.title}">` : ""}
      <div class="home-card-content">
        <h2>${course.title || ""}</h2>

        <div class="home-card-description clamp-4">
          ${renderMarkdown(course.description ?? "")}
        </div>

        <span class="home-card-read-more">Saiba mais</span>
      </div>
    `;

    item.addEventListener("click", () => {
      window.location.href =
        `${BASE_PATH}/pages/visitor/cursos-details.html?id=${course.id}`;
    });

    coursesListContainer.appendChild(item);
  }
}
