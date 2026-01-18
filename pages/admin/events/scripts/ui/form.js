import { dom } from "../dom.js";
import { state, setSelectedEvents } from "../state.js";
import { getEventsFile } from "../services/eventsService.js";

export function autoResize(el) {
  el.style.height = "auto";
  el.style.height = el.scrollHeight + "px";
}

export function showFormScreen(action) {
  dom.content.style.display = "none";
  dom.newBtn.style.display = "none";
  dom.contentForm.style.display = "block";
  dom.previewContent.style.display = "none";
  dom.sideBarMenu.style.display = "block";
  dom.nullContent.style.display = "none";

  if (action === "new") {
    dom.saveBtn[0].children[1].textContent = "Salvar rascunho";
  }
  
  const desc = dom.descInput();
  desc.addEventListener("input", () => {autoResize(desc)});
  setTimeout(() => autoResize(desc), 0);
}

export async function openEditForm(event) {
  if (event) setSelectedEvents(event);

  if (state.selectedEvents?.is_draft) {
    dom.form_title.textContent = "Editar rascunho";
    dom.saveBtn[0].children[1].textContent = "Salvar rascunho";
  } else {
    dom.form_title.textContent = "Editar evento";
    dom.saveBtn[0].children[1].textContent = "Salvar";
  }

  dom.titleInput().value = state.selectedEvents?.title || "";

  const desc = dom.descInput();
  desc.value = state.selectedEvents?.description || "";

  const filePrev = dom.filePreviewOnForm();

  if (state.selectedEvents?.hasFile && state.selectedEvents.id) {
    const res = await getEventsFile(state.selectedEvents.id);
    if (res.ok) {
      filePrev.src = URL.createObjectURL(res.data);
      filePrev.style.display = "block";
      dom.customBtn.style.display = "none";
    }
  } else {
    filePrev.style.display = "none";
    dom.customBtn.style.display = "flex";
  }

  showFormScreen("edit");

  desc.addEventListener("input", () => autoResize(desc));
  setTimeout(() => autoResize(desc), 0);
}