import { dom } from "./dom.js";
import { state, setSelectedEvents, clearSelectedEvents } from "./state.js";
import { pushScreen, goBack } from "./navigation.js";
import { openEditForm, showFormScreen } from "./ui/form.js";
import { showPreviewScreen } from "./ui/preview.js";
import { uploadEventsFile, createEvents, updateEvents, deactivateEvents, publishEvents } from "./services/eventsService.js";
import { registerMarkdownEvents } from "../../../../assets/markdownMenu.js";

export function showListScreen() {
  state.currentScreen = "LIST";
  state.screenStack.length = 0;

  clearSelectedEvents();

  dom.content.style.display = "block";
  dom.newBtn.style.display = "flex";
  dom.previewContent.style.display = "none";
  dom.contentForm.style.display = "none";
  dom.sideBarMenu.style.display = "block";
    
  if(state.listLength === 0) {
    dom.content.style.display = "none";
    dom.nullContent.style.display = "flex"; 
  }
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

export function registerEvents({ renderEventsLists }) {const items = dom.items();
  const container = dom.content;

  if (!container || container.dataset.bound === "true") return;

  container.addEventListener("click", async (event) => {
    const item = event.target.closest(".item");
    if (!item) return;

    const data = JSON.parse(item.dataset.data);

    setSelectedEvents(data);
    pushScreen("PREVIEW");
    await showPreviewScreen(data);
  });

  // editar (na preview)
  const editBtn = dom.editBtn();
  if (editBtn) {
    editBtn.onclick = async () => {
      await openEditForm(state.selectedEvents);
      pushScreen("FORM");
      dom.formDeleteBtn().style.display = "flex";
    };
  }

  // salvar (form)
  if (dom.saveBtn) {
    dom.saveBtn.forEach((btn) => {
      btn.onclick = async () => {
        await saveEvents(renderEventsLists);
        state.isEdited = false;
      }
    });
  }

  const previewBtn = dom.previewBtn();
    if (previewBtn) {
      previewBtn.forEach((btn) => {
        btn.onclick = () => {
          const fd = new FormData(dom.form);

          if(state.selectedEvents) {
            const updated_event = {
              ...state.selectedEvents,
              title: fd.get("title"),
              description: fd.get("description"),
            };

            state.lastTransientPreview.events = updated_event;
            pushScreen("PREVIEW");
            showPreviewScreen(updated_event);
          } else {
            const new_event = {
              title: fd.get("title"),
              description: fd.get("description"),
              is_draft: true,
              hasFile: false,
            };

            state.lastTransientPreview.events = new_event;
            pushScreen("PREVIEW");
            showPreviewScreen(new_event);
          }
        };
      })
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
  
  const formDeleteBtn = dom.formDeleteBtn();
  if(deleteBtn) {
    formDeleteBtn.onclick = () => {
      dom.deleteModal.style.display = "flex";
    }
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
      dom.nullContent.style.display = "none";
      dom.filePreviewOnForm().style.display = "none";
      dom.formDeleteBtn().style.display = "none";

      dom.form_title.textContent = "Adicionar evento";
      
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
  
  dom.form.addEventListener("input", () => {
    if(!state.isEdited) {
      state.isEdited = true;
    }
  })

  const dontSaveBtn = dom.dontSaveBtn();
  if (dontSaveBtn) dontSaveBtn.onclick = () => {
    dom.confirmationModal.style.display = "none";
    
    if(state.screenStack[0] == 'LIST') {
      showPreviewScreen(state.selectedEvents);
    } else {
      showListScreen();
    }

    state.isEdited = false;
  }

  const cancel = dom.cancelDeleteBtn();
  if (cancel) cancel.onclick = () => (dom.deleteModal.style.display = "none");
  
  const textarea = dom.descInput();
  registerMarkdownEvents(textarea)
}