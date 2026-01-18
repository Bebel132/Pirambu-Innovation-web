import { dom } from "./dom.js";
import { state, clearSelectedEvents } from "./state.js";

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
  const previous = popScreen();

  switch (previous) {
    case "FORM":
      handlers.showFormScreen();
      break;

    case "PREVIEW":
      if (state.isEdited) {
        dom.confirmationModal.style.display = "flex";
        dom.saveBtnText.innerHTML = "";
        dom.saveBtnText.innerHTML = state.selectedEvents.is_draft ? "Salvar rascunho" : "Salvar";
      } else {
        handlers.showPreviewScreen(
          state.selectedEvents ||
          state.lastTransientPreview.events ||
          { title: "", description: "" }
        );
      }
      break;

    case "LIST":
      if (state.selectedEvents == null) {
        dom.confirmationModal.style.display = "flex";
        dom.saveBtnText.innerHTML = "Salvar rascunho";
      } 
      
      if (state.isEdited) {
        dom.confirmationModal.style.display = "flex";
        dom.saveBtnText.innerHTML = "";
        dom.saveBtnText.innerHTML = state.selectedEvents.is_draft ? "Salvar rascunho" : "Salvar";
      }
      
      if (state.selectedEvents != null && !state.isEdited) {
        handlers.showListScreen();
      }
      break;

    default:
      clearSelectedEvents();
      dom.form.reset();
      handlers.showListScreen();
      handlers.renderEventsLists();
      break;
  }
}