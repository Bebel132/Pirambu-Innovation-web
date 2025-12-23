import { dom } from "../dom.js";
import { state, setSelectedCourse } from "../state.js";
import { listCourses, getCourseFile } from "../services/courseService.js";

export async function renderCourseLists({ onEdit, onDelete }) {
  let drafts = [];
  let published = [];

  const response = await listCourses();
  response.data.forEach((course) => {
    course.is_draft ? drafts.push(course) : published.push(course);
  });

  if(drafts.length > 0 || published.length > 0) {
    await renderCourseListUI(drafts, ".drafts_list", "draft_item", { onEdit, onDelete });
    await renderCourseListUI(published, ".published_list", "published_item", { onEdit, onDelete });
  } else {
    dom.content.style.display = "none";
    dom.nullContent.style.display = "flex";
  }
}

async function renderCourseListUI(list, containerSelector, className, handlers) {
  const container = document.querySelector(containerSelector);
  container.innerHTML = "";

  for (const course of list) {
    const item = document.createElement("div");
    item.classList.add(className, "item");
    item.dataset.data = JSON.stringify(course);

    const titleSpan = document.createElement("span");
    titleSpan.append(course.title || "(Sem título)");
    item.append(titleSpan);

    const dots = document.createElement("span");
    dots.classList.add("material-symbols-outlined");
    dots.textContent = "more_horiz";
    item.append(dots);

    const div = document.createElement("div");
    div.classList.add("item-actions");

    const editButton = document.createElement("button");
    editButton.innerHTML = '<span class="material-symbols-outlined">edit</span> Editar';

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<span class="material-symbols-outlined">delete</span> Excluir';

    div.appendChild(editButton);
    div.appendChild(deleteButton);
    item.append(div);

    // background (imagem/placeholder)
    if (course.hasFile) {
      const res = await getCourseFile(course.id);
      if (res.ok) item.style.backgroundImage = `url(${URL.createObjectURL(res.data)})`;
      else item.style.backgroundColor = "var(--color-gray)";
    } else {
      item.style.backgroundColor = "var(--color-gray)";
    }

    container.appendChild(item);

    dots.onclick = (e) => {
      e.stopPropagation();
      div.style.display = "flex";
    };

    editButton.onclick = async (e) => {
      e.stopPropagation();
      div.style.display = "none";

      const parsed = JSON.parse(item.dataset.data);
      setSelectedCourse(parsed);

      await handlers.onEdit(parsed);
    };

    deleteButton.onclick = () => {
      const parsed = JSON.parse(item.dataset.data);
      setSelectedCourse(parsed);
      handlers.onDelete(parsed);
    };
  }
}

// fecha menus ao clicar fora / esc
export function registerActionMenuAutoClose() {
  function closeAllActionMenus() {
    document.querySelectorAll(".item-actions").forEach((el) => {
      el.style.display = "none";
    });
  }

  document.addEventListener("click", (e) => {
    const isInActions = e.target.closest(".item-actions");
    const isDots = e.target.closest(".material-symbols-outlined");
    if (!isInActions && !isDots) closeAllActionMenus();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllActionMenus();
  });
}