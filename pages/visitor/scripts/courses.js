import { api } from "../../../assets/apiHelper.js";
import { BASE_PATH } from "../../../assets/config.js";

export async function renderCoursesList() {
  const response = await api("courses/published");
  const courses = response?.data || [];

  const coursesListContainer = document.querySelector(".courses-list");
  if (!coursesListContainer) return;

  coursesListContainer.innerHTML = "";

  for (const course of courses) {
    const item = document.createElement("li");
    item.classList.add("courses_list-item", "item");

    const titleSpan = document.createElement("span");
    titleSpan.textContent = course.title;
    item.appendChild(titleSpan);

    if (course.hasFile) {
      const res = await api(`courses/${course.id}/file`);
      if (res?.ok && res.data) {
        const blobUrl = URL.createObjectURL(res.data);
        item.style.backgroundImage = `url(${blobUrl})`;
      }
    }

    item.addEventListener("click", () => {
      window.location.href =
        `${BASE_PATH}/pages/visitor/cursos-details.html?id=${course.id}`;
    });

    coursesListContainer.appendChild(item);
  }
}
