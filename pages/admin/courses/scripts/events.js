import { dom } from "./dom.js";
import { state, setSelectedCourse, clearSelectedCourse } from "./state.js";
import { pushScreen, goBack } from "./navigation.js";
import { openEditForm, showFormScreen } from "./ui/form.js";
import { showPreviewScreen } from "./ui/preview.js";
import { uploadCourseFile, createCourse, updateCourse, deactivateCourse, publishCourse } from "./services/courseService.js";

export function showListScreen() {
  state.currentScreen = "LIST";
  state.screenStack.length = 0;

  clearSelectedCourse();
  dom.confirmationModal.style.display = "none";

  dom.content.style.display = "block";
  dom.newBtn.style.display = "block";
  dom.previewContent.style.display = "none";
  dom.contentForm.style.display = "none";
  dom.sideBarMenu.style.display = "block";
}

async function uploadFileIfExists(courseId) {
  const fileInput = dom.fileInput();
  if (!fileInput) return;
  const file = fileInput.files[0];
  if (!file || !courseId) return;

  await uploadCourseFile(courseId, file);
}

async function saveCourse(renderCourseLists) {
  const formData = new FormData(dom.form);
  formData.delete("file");

  for (const [key, value] of formData.entries()) {
    if (value instanceof File) continue;
    if (key === "description") continue;

    const str = (typeof value === "string") ? value.trim() : String(value ?? "").trim();
    if (str.length === 0) {
      alert("preencha o formulário corretamente.");
      dom.confirmationModal.style.display = "none";
      return;
    }
  }

  if (!state.selectedCourse) {
    const res = await createCourse({
      title: formData.get("title"),
      description: formData.get("description"),
      start_date: formData.get("start_date"),
      end_date: formData.get("end_date"),
      is_draft: true,
    });

    setSelectedCourse(res.data);
    await uploadFileIfExists(state.selectedCourse.id);
  } else {
    await updateCourse(state.selectedCourse.id, {
      title: formData.get("title"),
      description: formData.get("description"),
      start_date: formData.get("start_date"),
      end_date: formData.get("end_date"),
      is_draft: state.selectedCourse.is_draft,
    });
  }

  dom.confirmationModal.style.display = "none";
  state.lastTransientPreview.course = null;

  clearSelectedCourse();
  dom.form.reset();
  showListScreen();
  await renderCourseLists();
}

export function registerEvents({ renderCourseLists }) {
  // editar (na preview)
  const editBtn = dom.editBtn();
  if (editBtn) {
    editBtn.onclick = async () => {
      await openEditForm(state.selectedCourse);
      pushScreen("FORM");
    };
  }

  // salvar (form)
  if (dom.saveBtn) {
    dom.saveBtn.forEach((btn) => {
      btn.onclick = async () => await saveCourse(renderCourseLists);
    });
  }

  // preview do form (novo registro)
  const previewBtn = dom.previewBtn();
  if (previewBtn) {
    previewBtn.onclick = () => {
      const fd = new FormData(dom.form);

      const new_course = {
        title: fd.get("title"),
        description: fd.get("description"),
        start_date: fd.get("start_date"),
        end_date: fd.get("end_date"),
        is_draft: true,
        hasFile: false,
      };

      state.lastTransientPreview.course = new_course;
      pushScreen("PREVIEW");
      showPreviewScreen(new_course);
    };
  }

  // deletar
  const deleteBtn = dom.deleteBtn();
  if (deleteBtn) {
    deleteBtn.onclick = async () => {
      if (!state.selectedCourse?.id) return;

      await deactivateCourse(state.selectedCourse.id);

      dom.deleteModal.style.display = "none";
      clearSelectedCourse();
      dom.form.reset();
      showListScreen();
      renderCourseLists();
    };
  }

  // publicar
  const publishBtn = dom.publishBtn();
  if (publishBtn) {
    publishBtn.onclick = async () => {
      if (!state.selectedCourse?.id) return;

      await publishCourse(state.selectedCourse.id);

      clearSelectedCourse();
      dom.form.reset();
      showListScreen();
      renderCourseLists();
    };
  }

  // upload de arquivo
  const fileInput = dom.fileInput();
  if (fileInput) {
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      const preview = dom.filePreviewOnForm();

      if (file) {
        preview.src = URL.createObjectURL(file);
        preview.style.display = "block";
        dom.customBtn.style.display = "none";

        if (state.selectedCourse?.id) {
          await uploadCourseFile(state.selectedCourse.id, file);
        }
      }
    };
  }

  // novo
  if (dom.newBtn) {
    dom.newBtn.onclick = () => {
      clearSelectedCourse();
      dom.form.reset();

      dom.customBtn.style.display = "flex";
      dom.filePreviewOnForm().style.display = "none";

      dom.form_title.textContent = "Adicionar curso";

      pushScreen("FORM");
      showFormScreen("new");
    };
  }

  // voltar
  dom.backBtn.forEach((btn) => {
    btn.onclick = () =>
      goBack({
        showFormScreen,
        showPreviewScreen,
        showListScreen,
        renderCourseLists,
      });
  });

  const dontSaveBtn = dom.dontSaveBtn();
  if (dontSaveBtn) dontSaveBtn.onclick = () => showListScreen();

  const cancel = dom.cancelDeleteBtn();
  if (cancel) cancel.onclick = () => (dom.deleteModal.style.display = "none");
}
