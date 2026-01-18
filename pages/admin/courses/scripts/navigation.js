import { dom } from "./dom.js";
import { state, clearSelectedCourse } from "./state.js";

export function openConfirmationModal() {
  dom.confirmationModal.style.display = "flex";

  dom.saveBtnText.textContent =
    state.selectedCourse?.is_draft ? "Salvar rascunho" : "Salvar";
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
 * handlers = { showFormScreen, showPreviewScreen, showListScreen, renderCourseLists }
 */
export function goBack(handlers) {
  const previous = popScreen();

  if (state.isEdited) {
    dom.confirmationModal.style.display = "flex";
    dom.saveBtnText.textContent =
      state.selectedCourse?.is_draft ? "Salvar rascunho" : "Salvar";
    return;
  }

  switch (previous) {
    case "FORM":
      handlers.showFormScreen();
      break;

    case "PREVIEW":
      handlers.showPreviewScreen(
        state.selectedCourse ||
        state.lastTransientPreview.course ||
        {}
      );
      break;

    case "LIST":
    default:
      clearSelectedCourse();
      handlers.showListScreen();
      handlers.renderCourseLists();
      break;
  }
}