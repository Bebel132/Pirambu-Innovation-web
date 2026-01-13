import { dom } from "../dom.js";
import { state, setSelectedNews } from "../state.js";
import { listNewss, getNewsFile } from "../services/newsService.js";

export async function renderNewsLists({ onEdit, onDelete }) {
  let drafts = [];
  let published = [];

  const response = await listNewss();
  response.data.forEach((news) => {
    news.is_draft ? drafts.push(news) : published.push(news);
  });
    
  state.listLength = drafts.length + published.length;

  if(drafts.length > 0 || published.length > 0) {
    await renderNewsListUI(drafts, ".drafts_list", "draft_item", { onEdit, onDelete });
    await renderNewsListUI(published, ".published_list", "published_item", { onEdit, onDelete });
    dom.content.style.display = "block";
    dom.nullContent.style.display = " none";
  } else {
    dom.content.style.display = "none";
    dom.nullContent.style.display = "flex";
  }
}

async function renderNewsListUI(list, containerSelector, className, handlers) {
  const container = document.querySelector(containerSelector);
  container.innerHTML = "";

  for (const news of list) {
    const item = document.createElement("div");
    item.classList.add(className, "item");
    item.dataset.data = JSON.stringify(news);

    const titleSpan = document.createElement("span");
    titleSpan.append(news.title || "(Sem título)");
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
    if (news.hasFile) {
      const res = await getNewsFile(news.id);
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
      setSelectedNews(parsed);

      await handlers.onEdit(parsed);
    };

    deleteButton.onclick = (e) => {
      e.stopPropagation();
      
      const parsed = JSON.parse(item.dataset.data);
      setSelectedNews(parsed);
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