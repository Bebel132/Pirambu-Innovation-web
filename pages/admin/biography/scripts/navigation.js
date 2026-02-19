import { dom } from "./dom.js";
import { state, clearSelectedProjects } from "./state.js";
import { getAboutUs } from "./services/aboutUsService.js";

export function openConfirmationModal() {
  dom.confirmationModal.style.display = "flex";

  dom.saveBtnText.textContent =
    state.selectedProjects?.is_draft ? "Salvar rascunho" : "Salvar";
}

export function closeConfirmationModal() {
  dom.confirmationModal.style.display = "none";
}

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
  if (state.isEdited && (state.currentScreen === "FORM" || state.currentScreen === "FORM ABOUT US")) {
    openConfirmationModal();
    return;
  }

  const previous = popScreen();

  switch (previous) {
    case "FORM":
      handlers.showFormScreen();
      break;

    case "PREVIEW":
      handlers.showPreviewScreen(
        state.selectedProjects ||
        state.lastTransientPreview.projects ||
        { title: "", description: "" }
      );
      break;

    case "FORM ABOUT US":
      handlers.openAboutUsEditForm(state.lastTransientPreview.aboutUs);
      break;

    case "PREVIEW ABOUT US": {
      const aboutUs = await getAboutUs();
      handlers.showAboutUsPreviewScreen(aboutUs.data);
      break;
    }

    case "LIST":
    default:
      clearSelectedProjects();
      dom.form.reset();
      handlers.showListScreen();
      handlers.renderProjectsLists?.();
      break;
  }
}