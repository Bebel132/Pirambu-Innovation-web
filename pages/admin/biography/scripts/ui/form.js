import { dom } from "../dom.js";
import { state, setSelectedProjects } from "../state.js";
import { getProjectsFile } from "../services/projectsService.js";

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
}

export async function openEditForm(project) {
  if (project) setSelectedProjects(project);

  if (state.selectedProjects?.is_draft) {
    dom.form_title.textContent = "Editar rascunho";
    dom.saveBtn[0].children[1].textContent = "Salvar rascunho";
  } else {
    dom.form_title.textContent = "Editar projeto";
    dom.saveBtn[0].children[1].textContent = "Salvar";
  }

  dom.titleInput().value = state.selectedProjects?.title || "";

  const desc = dom.descInput();
  desc.value = state.selectedProjects?.description || "";

  const filePrev = dom.filePreviewOnForm();

  if (state.selectedProjects?.hasFile && state.selectedProjects.id) {
    const res = await getProjectsFile(state.selectedProjects.id);
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