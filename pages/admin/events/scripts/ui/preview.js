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
  } else {
    if(dom.fileInput()?.files[0]) {
      dom.file_preview.src = URL.createObjectURL(dom.fileInput().files[0]);
    }
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

  if(event.is_draft && state.screenStack[state.screenStack.length -1] == "FORM") {
    publishBtn.style.display = "none";
    editBtn.style.display = "none";
  } else if(!event.is_draft && state.screenStack[state.screenStack.length -1] == "FORM") {
    publishBtn.style.display = "none"; 
    editBtn.style.display = "none";
  } else if(event.is_draft && state.screenStack[state.screenStack.length -1] == "LIST") {
    publishBtn.style.display = "flex"; 
    editBtn.style.display = "flex";
  } else if(!event.is_draft && state.screenStack[state.screenStack.length -1] == "LIST") {
    publishBtn.style.display = "none"; 
    editBtn.style.display = "flex";
  }
}