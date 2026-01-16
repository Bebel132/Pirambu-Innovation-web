import { dom } from "./dom.js";
import { state, setSelectedNews, clearSelectedNews } from "./state.js";
import { pushScreen, goBack } from "./navigation.js";
import { openEditForm, showFormScreen } from "./ui/form.js";
import { showPreviewScreen } from "./ui/preview.js";
import { uploadNewsFile, createNews, updateNews, deactivateNews, publishNews } from "./services/newsService.js";
import { registerMarkdownEvents } from "../../../../assets/markdownMenu.js";

export function showListScreen() {
  state.currentScreen = "LIST";
  state.screenStack.length = 0;

  clearSelectedNews();
  dom.confirmationModal.style.display = "none";

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

async function uploadFileIfExists(newsId) {
  const fileInput = dom.fileInput();
  if (!fileInput) return;
  const file = fileInput.files[0];
  if (!file || !newsId) return;

  await uploadNewsFile(newsId, file);
}

async function saveNews(renderNewsLists) {
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

  if (!state.selectedNews) {
    const res = await createNews({
      title: formData.get("title"),
      description: formData.get("description"),
      is_draft: true,
    });

    setSelectedNews(res.data);
    await uploadFileIfExists(state.selectedNews.id);
  } else {
    await updateNews(state.selectedNews.id, {
      title: formData.get("title"),
      description: formData.get("description"),
      is_draft: state.selectedNews.is_draft,
    });
  }

  dom.confirmationModal.style.display = "none";
  state.lastTransientPreview.news = null;

  clearSelectedNews();
  dom.form.reset();
  showListScreen();
  await renderNewsLists();
}

export function registerEvents({ renderNewsLists }) {
  const container = dom.content;
  
  if (!container || container.dataset.bound === "true") return;

  container.addEventListener("click", async (event) => {
    const item = event.target.closest(".item");
    if (!item) return;

    const data = JSON.parse(item.dataset.data);

    setSelectedNews(data);
    pushScreen("PREVIEW");
    await showPreviewScreen(data);
    state.inAboutUs = false;
  });
  
  // editar (na preview)
  const editBtn = dom.editBtn();
  if (editBtn) {
    editBtn.onclick = async () => {
      await openEditForm(state.selectedNews);
      pushScreen("FORM");
    };
  }

  // salvar (form)
  if (dom.saveBtn) {
    dom.saveBtn.forEach((btn) => {
      btn.onclick = async () => await saveNews(renderNewsLists);
    });
  }

  const previewBtn = dom.previewBtn();
    if (previewBtn) {
      previewBtn.forEach((btn) => {
        btn.onclick = () => {
          const fd = new FormData(dom.form);
          
          if(state.selectedNews) {
            const updated_news = {
              ...state.selectedNews,
              title: fd.get("title"),
              description: fd.get("description"),
            };

            state.lastTransientPreview.news = updated_news;
            pushScreen("PREVIEW");
            showPreviewScreen(updated_news);
          } else {
            const new_news = {
              title: fd.get("title"),
              description: fd.get("description"),
              is_draft: true,
              hasFile: false,
            };

            state.lastTransientPreview.news = new_news;
            pushScreen("PREVIEW");
            showPreviewScreen(new_news);
          }
        };
      })
    }

  // deletar
  const deleteBtn = dom.deleteBtn();
  if (deleteBtn) {
    deleteBtn.onclick = async () => {
      if (!state.selectedNews?.id) return;

      await deactivateNews(state.selectedNews.id);

      dom.deleteModal.style.display = "none";
      clearSelectedNews();
      dom.form.reset();
      showListScreen();
      renderNewsLists();
    };
  }

  // publicar
  const publishBtn = dom.publishBtn();
  if (publishBtn) {
    publishBtn.onclick = async () => {
      if (!state.selectedNews?.id) return;

      await publishNews(state.selectedNews.id);

      clearSelectedNews();
      dom.form.reset();
      showListScreen();
      renderNewsLists();
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

        if (state.selectedNews?.id) {
          await uploadNewsFile(state.selectedNews.id, file);
        }
      }
    };
  }

  // novo
  if (dom.newBtn) {
    dom.newBtn.onclick = () => {
      clearSelectedNews();
      dom.form.reset();

      dom.customBtn.style.display = "flex";
      dom.filePreviewOnForm().style.display = "none";

      dom.form_title.textContent = "Adicionar notícia";

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
        renderNewsLists,
      });
  });

  const dontSaveBtn = dom.dontSaveBtn();
  if (dontSaveBtn) dontSaveBtn.onclick = () => showListScreen();

  const cancel = dom.cancelDeleteBtn();
  if (cancel) cancel.onclick = () => (dom.deleteModal.style.display = "none");
  
  const textarea = dom.descInput();
  registerMarkdownEvents(textarea)
}