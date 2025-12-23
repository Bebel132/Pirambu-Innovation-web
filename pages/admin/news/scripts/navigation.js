import { dom } from "./dom.js";
import { state, clearSelectedNews } from "./state.js";

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
 * handlers = { showFormScreen, showPreviewScreen, showListScreen, renderNewsLists }
 */
export function goBack(handlers) {
  const previous = popScreen();

  switch (previous) {
    case "FORM":
      handlers.showFormScreen();
      break;

    case "PREVIEW":
      handlers.showPreviewScreen(
        state.selectedNews ||
        state.lastTransientPreview.news ||
        { title: "", description: "" }
      );
      break;

    case "LIST":
      if (state.selectedNews == null) {
        dom.confirmationModal.style.display = "flex";
      } else {
        handlers.showListScreen();
      }
      break;

    default:
      clearSelectedNews();
      dom.form.reset();
      handlers.showListScreen();
      handlers.renderNewsLists();
      break;
  }
}