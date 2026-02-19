import { dom } from "./dom.js";
import { state, clearSelectedEvents } from "./state.js";

export function openConfirmationModal() {
  dom.confirmationModal.style.display = "flex";

  dom.saveBtnText.textContent =
    state.selectedEvents?.is_draft ? "Salvar rascunho" : "Salvar";
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
 * handlers = { showFormScreen, showPreviewScreen, showListScreen, renderEventsLists }
 */
export function goBack(handlers) {
  if (state.isEdited && state.currentScreen === "FORM") {
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
        state.selectedEvents ||
        state.lastTransientPreview.events ||
        {}
      );
      break;

    case "LIST":
    default:
      clearSelectedEvents();
      handlers.showListScreen();
      handlers.renderEventsLists();
      break;
  }
}