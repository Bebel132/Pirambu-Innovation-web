import { dom } from "./dom.js";
import { state, setSelectedEvents, clearSelectedEvents } from "./state.js";
import { pushScreen, goBack } from "./navigation.js";
import { openEditForm, showFormScreen } from "./ui/form.js";
import { showPreviewScreen } from "./ui/preview.js";
import { uploadEventsFile, createEvents, updateEvents, deactivateEvents, publishEvents } from "./services/eventsService.js";

export function showListScreen() {
  state.currentScreen = "LIST";
  state.screenStack.length = 0;

  clearSelectedEvents();
  dom.confirmationModal.style.display = "none";

  dom.content.style.display = "block";
  dom.newBtn.style.display = "block";
  dom.previewContent.style.display = "none";
  dom.contentForm.style.display = "none";
  dom.sideBarMenu.style.display = "block";
}

async function uploadFileIfExists(eventsId) {
  const fileInput = dom.fileInput();
  if (!fileInput) return;
  const file = fileInput.files[0];
  if (!file || !eventsId) return;

  await uploadEventsFile(eventsId, file);
}

async function saveEvents(renderEventsLists) {
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

  if (!state.selectedEvents) {
    const res = await createEvents({
      title: formData.get("title"),
      description: formData.get("description"),
      is_draft: true,
    });

    setSelectedEvents(res.data);
    await uploadFileIfExists(state.selectedEvents.id);
  } else {
    await updateEvents(state.selectedEvents.id, {
      title: formData.get("title"),
      description: formData.get("description"),
      is_draft: state.selectedEvents.is_draft,
    });
  }

  dom.confirmationModal.style.display = "none";
  state.lastTransientPreview.events = null;

  clearSelectedEvents();
  dom.form.reset();
  showListScreen();
  await renderEventsLists();
}

export function registerEvents({ renderEventsLists }) {
  // editar (na preview)
  const editBtn = dom.editBtn();
  if (editBtn) {
    editBtn.onclick = async () => {
      await openEditForm(state.selectedEvents);
      pushScreen("FORM");
    };
  }

  // salvar (form)
  if (dom.saveBtn) {
    dom.saveBtn.forEach((btn) => {
      btn.onclick = async () => await saveEvents(renderEventsLists);
    });
  }

  // preview do form (novo registro)
  const previewBtn = dom.previewBtn();
  if (previewBtn) {
    previewBtn.onclick = () => {
      const fd = new FormData(dom.form);

      const new_events = {
        title: fd.get("title"),
        description: fd.get("description"),
        is_draft: true,
        hasFile: false,
      };

      state.lastTransientPreview.events = new_events;
      pushScreen("PREVIEW");
      showPreviewScreen(new_events);
    };
  }

  // deletar
  const deleteBtn = dom.deleteBtn();
  if (deleteBtn) {
    deleteBtn.onclick = async () => {
      if (!state.selectedEvents?.id) return;

      await deactivateEvents(state.selectedEvents.id);

      dom.deleteModal.style.display = "none";
      clearSelectedEvents();
      dom.form.reset();
      showListScreen();
      renderEventsLists();
    };
  }

  // publicar
  const publishBtn = dom.publishBtn();
  if (publishBtn) {
    publishBtn.onclick = async () => {
      if (!state.selectedEvents?.id) return;

      await publishEvents(state.selectedEvents.id);

      clearSelectedEvents();
      dom.form.reset();
      showListScreen();
      renderEventsLists();
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

        if (state.selectedEvents?.id) {
          await uploadEventsFile(state.selectedEvents.id, file);
        }
      }
    };
  }

  // novo
  if (dom.newBtn) {
    dom.newBtn.onclick = () => {
      clearSelectedEvents();
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
        renderEventsLists,
      });
  });

  const dontSaveBtn = dom.dontSaveBtn();
  if (dontSaveBtn) dontSaveBtn.onclick = () => showListScreen();

  const cancel = dom.cancelDeleteBtn();
  if (cancel) cancel.onclick = () => (dom.deleteModal.style.display = "none");
}