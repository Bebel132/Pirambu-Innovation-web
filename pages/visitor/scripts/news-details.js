import { api } from "../../../assets/apiHelper.js";
import { renderMarkdown } from "../../../assets/markdown.js";
import { API_URL } from "../../../assets/config.js";

async function loadNews() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) return;

  const response = await api(`news/${id}`);
  if (!response?.ok) return;

  const news = response.data;

  const titleEl = document.getElementById("newsTitle");
  const contentEl = document.getElementById("newsContent");
  const imageEl = document.getElementById("newsImage");

  // TÍTULO
  if (titleEl) {
    titleEl.textContent = news.title || "";
  }

  // TEXTO
  if (contentEl) {
    contentEl.innerHTML = renderMarkdown(news.description || "");
  }

  // IMAGEM
  if (news.hasFile && imageEl) {
    imageEl.src = `${API_URL}/news/${news.id}/file`;
  }
}

document.addEventListener("DOMContentLoaded", loadNews);
