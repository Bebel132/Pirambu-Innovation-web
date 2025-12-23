import { dom } from "./dom.js";
import { state, clearSelectedCourse } from "./state.js";

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

  switch (previous) {
    case "FORM":
      handlers.showFormScreen();
      break;

    case "PREVIEW":
      handlers.showPreviewScreen(
        state.selectedCourse ||
        state.lastTransientPreview.course ||
        { title: "", description: "" }
      );
      break;

    case "LIST":
      if (state.selectedCourse == null) {
        dom.confirmationModal.style.display = "flex";
      } else {
        handlers.showListScreen();
      }
      break;

    default:
      clearSelectedCourse();
      dom.form.reset();
      handlers.showListScreen();
      handlers.renderCourseLists();
      break;
  }
}