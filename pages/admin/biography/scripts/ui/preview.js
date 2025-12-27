import { dom } from "../dom.js";
import { state } from "../state.js";
import { renderMarkdown } from "../../../../../assets/markdown.js";
import { getProjectsFile } from "../services/projectsService.js";

export async function renderPreview(project) {
  const preview_title = document.querySelector(".preview-title");
  const preview_description = document.querySelector(".preview-description");

  preview_title.textContent = project.title || "";

  preview_description.innerHTML = renderMarkdown(project.description || "");
  dom.file_preview.src = "";
  
  if (project.hasFile) {
    const res = await getProjectsFile(project.id);
    if (res.ok) dom.file_preview.src = URL.createObjectURL(res.data);
  }
}

export async function showPreviewScreen(project) {
  if (!project.id) {
    state.lastTransientPreview.project = project;
  }

  await renderPreview(project);

  dom.content.style.display = "none";
  dom.contentForm.style.display = "none";
  dom.newBtn.style.display = "none";
  dom.previewContent.style.display = "block";
  dom.sideBarMenu.style.display = "none";

  const publishBtn = dom.publishBtn();
  const editBtn = dom.editBtn();

  if (!publishBtn || !editBtn) return;

  if (project.active && project.is_draft) {
    publishBtn.style.display = "flex";
    editBtn.style.display = "flex";
  } else if (project.active === undefined) {
    publishBtn.style.display = "flex";
    editBtn.style.display = "none";
  } else {
    publishBtn.style.display = "none";
    editBtn.style.display = "flex";
  }
}