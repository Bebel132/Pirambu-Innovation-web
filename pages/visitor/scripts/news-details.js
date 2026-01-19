import { api } from "../../../assets/apiHelper.js";
import { renderMarkdown } from "../../../assets/markdown.js";

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
    try {
      const imgRes = await api(`news/${id}/file`);
      if (imgRes?.ok && imgRes.data) {
        imageEl.src = URL.createObjectURL(imgRes.data);
      }
    } catch {
      console.warn("Imagem da notícia não carregada:", id);
    }
  }
}

document.addEventListener("DOMContentLoaded", loadNews);
