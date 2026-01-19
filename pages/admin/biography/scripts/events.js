import { dom } from "./dom.js";
import { state, setSelectedProjects, clearSelectedProjects } from "./state.js";
import { pushScreen, goBack, closeConfirmationModal } from "./navigation.js";
import { openEditForm, showFormScreen } from "./ui/form.js";
import { showPreviewScreen } from "./ui/preview.js";
import { uploadProjectsFile, createProjects, updateProjects, deactivateProjects, publishProjects } from "./services/projectsService.js";
import { updateAboutUs } from "./services/aboutUsService.js";
import { getAboutUs, uploadAboutUsFile } from "./services/aboutUsService.js";
import { showAboutUsPreviewScreen } from "./ui/preview-aboutUs.js";
import { openAboutUsEditForm } from "./ui/form-aboutUs.js";
import { registerMarkdownEvents } from "../../../../assets/markdownMenu.js";

export function showListScreen() {
  state.currentScreen = "LIST";
  state.screenStack.length = 0;

  clearSelectedProjects();

  dom.content.style.display = "block";
  dom.newBtn.style.display = "flex";
  dom.previewContent.style.display = "none";
  dom.contentForm.style.display = "none";
  dom.sideBarMenu.style.display = "block";
  dom.aboutUsPreview.style.display = "none";
  dom.aboutUsContentForm.style.display = "none";
  
  if(state.listLength === 0) {
    dom.content.style.display = "none";
    dom.nullContent.style.display = "flex"; 
  }
}

async function uploadFileIfExists(projectsId) {
  const fileInput = dom.fileInput();
  if (!fileInput) return;
  const file = fileInput.files[0];
  if (!file || !projectsId) return;

  await uploadProjectsFile(projectsId, file);
}

async function saveProjects(renderProjectsLists) {
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

  if (!state.selectedProjects) {
    const res = await createProjects({
      title: formData.get("title"),
      description: formData.get("description"),
      is_draft: true,
    });

    setSelectedProjects(res.data);
    await uploadFileIfExists(state.selectedProjects.id);
  } else {
    await updateProjects(state.selectedProjects.id, {
      title: formData.get("title"),
      description: formData.get("description"),
      is_draft: state.selectedProjects.is_draft,
    });
  }

  dom.confirmationModal.style.display = "none";
  state.lastTransientPreview.projects = null;

  clearSelectedProjects();
  dom.form.reset();
  showListScreen();
  await renderProjectsLists();
  registerProjects()
}

export async function saveAboutUs() {
  const formData = new FormData(dom.aboutUsForm);

  const description = formData.get("description")?.toString().trim() || "";
  const instagram = formData.get("instagram")?.toString().trim() || "";
  const whatsapp = formData.get("whatsapp")?.toString().trim() || "";
  const endereco = formData.get("endereco")?.toString().trim() || "";

  await updateAboutUs({
    description,
    instagram,
    whatsapp,
    endereco
  });

  dom.aboutUsForm.reset();
  showListScreen();
}

export function registerProjects({ renderProjectsLists }) {
  const container = dom.content;

  if (!container || container.dataset.bound === "true") return;

  container.addEventListener("click", async (event) => {
    const item = event.target.closest(".item");
    if (!item) return;

    const data = JSON.parse(item.dataset.data);

    setSelectedProjects(data);
    pushScreen("PREVIEW");
    await showPreviewScreen(data);
    state.inAboutUs = false;
  });
  
  // editar (na preview)
  const editBtn = dom.editBtn();
  if (editBtn) {
    editBtn.onclick = async () => {
      await openEditForm(state.selectedProjects);
      pushScreen("FORM");
      dom.formDeleteBtn().style.display = "flex";
    };
  }

  dom.aboutUsEditBtn().onclick = async () => {
    const aboutUs = await getAboutUs();
    await openAboutUsEditForm(aboutUs.data);
    pushScreen("FORM ABOUT US");
  }

  // salvar (form)
  if (dom.saveBtn) {
    dom.saveBtn.forEach((btn) => {
      btn.onclick = async () => {
        await saveProjects(renderProjectsLists);
        state.isEdited = false;
      }
    });
  }

  dom.aboutUsSaveBtn.onclick = async () => await saveAboutUs();

  // preview do form (novo registro)
  const previewBtn = dom.previewBtn();
  previewBtn.forEach((btn) => {
    if (btn) {
      btn.onclick = async () => {
        if (state.inAboutUs) {
          const fd = new FormData(dom.aboutUsForm);
          
          const aboutUsContent = {
            description: fd.get("description"),
            hasFile: fd.get("file")?.size > 0 || dom.aboutUsFile_preview.src !== "",
          }

          state.lastTransientPreview.aboutUs = aboutUsContent;

          pushScreen("PREVIEW ABOUT US");
          await showAboutUsPreviewScreen(aboutUsContent);

          dom.aboutUsEditBtn().style.display = "none";
        } else {
          const fd = new FormData(dom.form);
          
          if(state.selectedProjects) {
            const updated_projects = {
              ...state.selectedProjects,
              title: fd.get("title"),
              description: fd.get("description"),
            };
            state.lastTransientPreview.projects = updated_projects;
            pushScreen("PREVIEW");
            showPreviewScreen(updated_projects);
          } else {
            const new_projects = {
              id: state.selectedProjects?.id,
              title: fd.get("title"),
              description: fd.get("description"),
              is_draft: true,
              hasFile: fd.get("file")?.size > 0 || dom.file_preview.src !== "",
            };
            
            state.lastTransientPreview.projects = new_projects;
  
            pushScreen("PREVIEW");
            showPreviewScreen(new_projects);
          }
        }
      };
    }
  })

  // deletar
  const deleteBtn = dom.deleteBtn();
  if (deleteBtn) {
    deleteBtn.onclick = async () => {
      if (!state.selectedProjects?.id) return;

      await deactivateProjects(state.selectedProjects.id);

      dom.deleteModal.style.display = "none";
      clearSelectedProjects();
      dom.form.reset();
      showListScreen();
      renderProjectsLists();
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
      if (!state.selectedProjects?.id) return;

      await publishProjects(state.selectedProjects.id);

      clearSelectedProjects();
      dom.form.reset();
      showListScreen();
      renderProjectsLists();
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

        if (state.selectedProjects?.id) {
          await uploadProjectsFile(state.selectedProjects?.id, file)
        }
      }
    };
  }

  const aboutUsFileInput = dom.aboutUsFileInput();
  if(aboutUsFileInput) {
    aboutUsFileInput.onchange = async (e) => {
      const file = e.target.files[0];

      if(file) {
        await uploadAboutUsFile(file);
        const preview = dom.aboutUsFilePreviewOnForm();
        preview.src = URL.createObjectURL(file);
        preview.style.display = "block";
        dom.aboutUsCustomBtn.style.display = "none";
      }
    }
  }

  // novo
  if (dom.newBtn) {
    dom.newBtn.onclick = () => {
      clearSelectedProjects();
      dom.form.reset();

      dom.customBtn.style.display = "flex";
      dom.nullContent.style.display = "none";
      dom.filePreviewOnForm().style.display = "none";
      dom.formDeleteBtn().style.display = "none";

      dom.form_title.textContent = "Adicionar projeto";

      pushScreen("FORM");
      showFormScreen("new");
    };
  }

  // voltar
  dom.backBtn.forEach((btn) => {
    btn.onclick = () =>
      goBack({
        showFormScreen,
        openAboutUsEditForm,
        showPreviewScreen,
        showAboutUsPreviewScreen,
        showListScreen,
        renderProjectsLists,
      });
  });
  
  dom.form.addEventListener("input", () => {
    if(!state.isEdited) {
      state.isEdited = true;
    }
  })

  dom.aboutUsWhatsappInput().addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, ""); // remove tudo que não é número

    // Limita no máximo 11 dígitos
    value = value.slice(0, 11);

    if (value.length > 10) {
      // Celular: (99) 99999-9999
      value = value.replace(
        /^(\d{2})(\d{5})(\d{4})$/,
        "($1) $2-$3"
      );
    } else if (value.length > 6) {
      // Fixo ou digitando: (99) 9999-9999
      value = value.replace(
        /^(\d{2})(\d{4})(\d{0,4})$/,
        "($1) $2-$3"
      );
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d+)/, "($1) $2");
    } else if (value.length > 0) {
      value = value.replace(/^(\d*)/, "($1");
    }

    e.target.value = value;
  })

  const dontSaveBtn = dom.dontSaveBtn();
  if (dontSaveBtn) {
    dontSaveBtn.onclick = () => {
      state.isEdited = false;
      closeConfirmationModal();

      goBack({
        showFormScreen,
        openAboutUsEditForm,
        showPreviewScreen,
        showAboutUsPreviewScreen,
        showListScreen,
        renderProjectsLists,
      });
    };
  }

  const cancel = dom.cancelDeleteBtn();
  if (cancel) cancel.onclick = () => (dom.deleteModal.style.display = "none");

  dom.aboutUsItem().onclick = async () => {
    pushScreen("PREVIEW ABOUT US");
    const aboutUs = await getAboutUs();
    showAboutUsPreviewScreen(aboutUs.data);
    state.inAboutUs = true;
  }

  const textarea = dom.descInput();
  registerMarkdownEvents(textarea);

  const aboutUsTextarea = dom.aboutUsDescInput();
  registerMarkdownEvents(aboutUsTextarea);
}