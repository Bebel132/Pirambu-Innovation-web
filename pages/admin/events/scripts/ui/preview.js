import { dom } from "../dom.js";
import { state } from "../state.js";
import { renderMarkdown } from "../../../../../assets/markdown.js";
import { getEventsFile } from "../services/eventsService.js";

export async function renderPreview(event) {
  const preview_title = document.querySelector(".preview-title");
  const preview_description = document.querySelector(".preview-description");

  preview_title.textContent = event.title || "";

  preview_description.innerHTML = renderMarkdown(event.description || "");
  dom.file_preview.src = "";

  if (event.hasFile && event.id) {
    const res = await getEventsFile(event.id);
    if (res.ok) dom.file_preview.src = URL.createObjectURL(res.data);
  }
}

export async function showPreviewScreen(event) {
  if (!event.id) {
    state.lastTransientPreview.event = event;
  }

  await renderPreview(event);

  dom.content.style.display = "none";
  dom.contentForm.style.display = "none";
  dom.newBtn.style.display = "none";
  dom.previewContent.style.display = "block";
  dom.sideBarMenu.style.display = "none";

  const publishBtn = dom.publishBtn();
  const editBtn = dom.editBtn();

  if (!publishBtn || !editBtn) return;

  if (event.active && event.is_draft) {
    publishBtn.style.display = "flex";
    editBtn.style.display = "flex";
  } else if (event.active === undefined) {
    publishBtn.style.display = "flex";
    editBtn.style.display = "none";
  } else {
    publishBtn.style.display = "none";
    editBtn.style.display = "flex";
  }
}