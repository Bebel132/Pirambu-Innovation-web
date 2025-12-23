import { dom } from "../dom.js";
import { state, setSelectedCourse } from "../state.js";
import { getCourseFile } from "../services/courseService.js";

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

  if (action === "new") {
    dom.saveBtn[0].children[1].textContent = "Salvar rascunho";
  }
}

export async function openEditForm(course) {
  if (course) setSelectedCourse(course);

  if (state.selectedCourse?.is_draft) {
    dom.form_title.textContent = "Editar rascunho";
    dom.saveBtn[0].children[1].textContent = "Salvar rascunho";
  } else {
    dom.form_title.textContent = "Editar curso";
    dom.saveBtn[0].children[1].textContent = "Salvar";
  }

  dom.titleInput().value = state.selectedCourse?.title || "";
  dom.startInput().value = state.selectedCourse?.start_date?.split("T")[0] || "";
  dom.endInput().value = state.selectedCourse?.end_date?.split("T")[0] || "";

  const desc = dom.descInput();
  desc.value = state.selectedCourse?.description || "";

  const filePrev = dom.filePreviewOnForm();

  if (state.selectedCourse?.hasFile && state.selectedCourse.id) {
    const res = await getCourseFile(state.selectedCourse.id);
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