import { dom } from "../dom.js";
import { state } from "../state.js";
import { renderMarkdown } from "../../../../../assets/markdown.js";
import { getNewsFile } from "../services/newsService.js";

export async function renderPreview(news) {
  const preview_title = document.querySelector(".preview-title");
  const preview_description = document.querySelector(".preview-description");

  preview_title.textContent = news.title || "";

  preview_description.innerHTML = renderMarkdown(news.description || "");
  dom.file_preview.src = "";

  if (news.hasFile && news.id) {
    const res = await getNewsFile(news.id);
    if (res.ok) dom.file_preview.src = URL.createObjectURL(res.data);
  }
}

export async function showPreviewScreen(news) {
  if (!news.id) {
    state.lastTransientPreview.news = news;
  }

  await renderPreview(news);

  dom.content.style.display = "none";
  dom.contentForm.style.display = "none";
  dom.newBtn.style.display = "none";
  dom.previewContent.style.display = "block";
  dom.sideBarMenu.style.display = "none";

  const publishBtn = dom.publishBtn();
  const editBtn = dom.editBtn();

  if (!publishBtn || !editBtn) return;

  if (news.active && news.is_draft) {
    publishBtn.style.display = "flex";
    editBtn.style.display = "flex";
  } else if (news.active === undefined) {
    publishBtn.style.display = "flex";
    editBtn.style.display = "none";
  } else {
    publishBtn.style.display = "none";
    editBtn.style.display = "flex";
  }
}