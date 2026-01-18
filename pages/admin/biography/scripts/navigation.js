import { dom } from "./dom.js";
import { state, clearSelectedProjects } from "./state.js";
import { getAboutUs } from "./services/aboutUsService.js";

export function pushScreen(screenName) {
  if (state.currentScreen) state.screenStack.push(state.currentScreen);
  state.currentScreen = screenName;
}

export function popScreen() {
  const prev = state.screenStack.pop();
  state.currentScreen = prev || "LIST";
  return prev;
}

/**
 * handlers = { showFormScreen, showPreviewScreen, showListScreen, renderProjectsLists }
 */
export async function goBack(handlers) {
  const previous = popScreen();

  switch (previous) {
    case "FORM":
      handlers.showFormScreen();
      break;

    case "PREVIEW ABOUT US":
      const aboutUs = await getAboutUs();
      handlers.showAboutUsPreviewScreen(aboutUs.data);
      break;

    case "FORM ABOUT US":
      handlers.openAboutUsEditForm(state.lastTransientPreview.aboutUs);
      break;

    case "PREVIEW":
      if (state.isEdited) {
        dom.confirmationModal.style.display = "flex";
        dom.saveBtnText.innerHTML = "";
        dom.saveBtnText.innerHTML = state.selectedProjects.is_draft ? "Salvar rascunho" : "Salvar";
      } else {
        handlers.showPreviewScreen(
          state.selectedProjects ||
          state.lastTransientPreview.projects ||
          { title: "", description: "" }
        );
      }
      break;

    case "LIST":
      if (state.selectedProjects == null && !state.inAboutUs) {
        dom.confirmationModal.style.display = "flex";
        dom.saveBtnText.innerHTML = "Salvar rascunho";
      } 
      
      if (state.isEdited) {
        dom.confirmationModal.style.display = "flex";
        dom.saveBtnText.innerHTML = "";
        dom.saveBtnText.innerHTML = state.selectedProjects.is_draft ? "Salvar rascunho" : "Salvar";
      }
      
      if (state.selectedProjects != null && !state.isEdited) {
        handlers.showListScreen();
      }

      if (state.selectedProjects == null && !state.isEdited) {
        handlers.showListScreen();
      }
      break;

    default:
      clearSelectedProjects();
      dom.form.reset();
      handlers.showListScreen();
      handlers.renderProjectsLists();
      break;
  }
}