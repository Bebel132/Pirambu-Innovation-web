import { dom } from "./dom.js";
import { state, setSelectedProjects, clearSelectedProjects } from "./state.js";
import { pushScreen, goBack } from "./navigation.js";
import { openEditForm, showFormScreen } from "./ui/form.js";
import { showPreviewScreen } from "./ui/preview.js";
import { uploadProjectsFile, createProjects, updateProjects, deactivateProjects, publishProjects } from "./services/projectsService.js";
import { updateAboutUs } from "./services/aboutUsService.js";
import { getAboutUs, uploadAboutUsFile } from "./services/aboutUsService.js";
import { showAboutUsPreviewScreen } from "./ui/preview-aboutUs.js";
import { openAboutUsEditForm } from "./ui/form-aboutUs.js";

export function showListScreen() {
  state.currentScreen = "LIST";
  state.screenStack.length = 0;

  clearSelectedProjects();
  dom.confirmationModal.style.display = "none";

  dom.content.style.display = "block";
  dom.newBtn.style.display = "block";
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
}

export async function saveAboutUs() {
  const formData = new FormData(dom.aboutUsForm);

  const description = formData.get("description")?.toString().trim() || "";

  await updateAboutUs({
    description,
  });

  dom.aboutUsForm.reset();
  showListScreen();
}

export function registerProjects({ renderProjectsLists }) {
  const items = dom.items();
  if (items) {
    items.forEach((item) => {
      item.onclick = async () => {
        const parsed = JSON.parse(item.dataset.data);
        setSelectedProjects(parsed);
        pushScreen("PREVIEW");
        await showPreviewScreen(parsed);
      };
    });
  }
  
  // editar (na preview)
  const editBtn = dom.editBtn();
  if (editBtn) {
    editBtn.onclick = async () => {
      await openEditForm(state.selectedProjects);
      pushScreen("FORM");
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
      btn.onclick = async () => await saveProjects(renderProjectsLists);
    });
  }

  dom.aboutUsSaveBtn.onclick = async () => await saveAboutUs();

  // preview do form (novo registro)
  const previewBtn = dom.previewBtn();
  previewBtn.forEach((btn) => {
    if (btn) {
      btn.onclick = () => {
        if (state.inAboutUs) {
          const fd = new FormData(dom.aboutUsForm);
          
          const aboutUsContent = {
            description: fd.get("description"),
            hasFile: fd.get("file")?.size > 0 || dom.aboutUsFile_preview.src !== "",
          }

          state.lastTransientPreview.aboutUs = aboutUsContent;

          pushScreen("PREVIEW ABOUT US");
          showAboutUsPreviewScreen(aboutUsContent);
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
      
      if (file) {
        dom.customBtn.style.display = "none";
        
        if (state.selectedProjects?.id && !state.inAboutUs) {
          await uploadProjectsFile(state.selectedProjects.id, file);
          const preview = dom.filePreviewOnForm();
          preview.src = URL.createObjectURL(file);
          preview.style.display = "block";
        } else {
          await uploadAboutUsFile(file);
          const preview = dom.aboutUsFilePreviewOnForm();
          preview.src = URL.createObjectURL(file);
          preview.style.display = "block";
        }
      }
    };
  }

  // novo
  if (dom.newBtn) {
    dom.newBtn.onclick = () => {
      clearSelectedProjects();
      dom.form.reset();

      dom.customBtn.style.display = "flex";
      dom.filePreviewOnForm().style.display = "none";

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

  const dontSaveBtn = dom.dontSaveBtn();
  if (dontSaveBtn) dontSaveBtn.onclick = () => showListScreen();

  const cancel = dom.cancelDeleteBtn();
  if (cancel) cancel.onclick = () => (dom.deleteModal.style.display = "none");

  dom.aboutUsItem().onclick = async () => {
    pushScreen("PREVIEW ABOUT US");
    const aboutUs = await getAboutUs();
    showAboutUsPreviewScreen(aboutUs.data);
    state.inAboutUs = true;
  }
}