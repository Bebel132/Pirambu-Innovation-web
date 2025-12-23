import { dom } from "../dom.js";
import { state } from "../state.js";
import { renderMarkdown } from "../../../../../assets/markdown.js";
import { getCourseFile } from "../services/courseService.js";

export async function renderPreview(course) {
  const preview_title = document.querySelector(".preview-title");
  const preview_date = document.querySelector(".preview-dates");
  const preview_description = document.querySelector(".preview-description");

  preview_title.textContent = course.title || "";

  try {
    const s = course.start_date ? new Date(course.start_date).toLocaleDateString() : "";
    const e = course.end_date ? new Date(course.end_date).toLocaleDateString() : "";
    preview_date.textContent = s && e ? `${s} à ${e}` : "";
  } catch {
    preview_date.textContent = "";
  }

  preview_description.innerHTML = renderMarkdown(course.description || "");
  dom.file_preview.src = "";

  if (course.hasFile && course.id) {
    const res = await getCourseFile(course.id);
    if (res.ok) dom.file_preview.src = URL.createObjectURL(res.data);
  }
}

export async function showPreviewScreen(course) {
  if (!course.id) {
    state.lastTransientPreview.course = course;
  }

  await renderPreview(course);

  dom.content.style.display = "none";
  dom.contentForm.style.display = "none";
  dom.newBtn.style.display = "none";
  dom.previewContent.style.display = "block";
  dom.sideBarMenu.style.display = "none";

  const publishBtn = dom.publishBtn();
  const editBtn = dom.editBtn();

  if (!publishBtn || !editBtn) return;

  if (course.active && course.is_draft) {
    publishBtn.style.display = "flex";
    editBtn.style.display = "flex";
  } else if (course.active === undefined) {
    publishBtn.style.display = "flex";
    editBtn.style.display = "none";
  } else {
    publishBtn.style.display = "none";
    editBtn.style.display = "flex";
  }
}
