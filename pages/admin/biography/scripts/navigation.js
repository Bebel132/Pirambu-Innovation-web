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
      handlers.showPreviewScreen(
        state.selectedProjects ||
        state.lastTransientPreview.projects ||
        { title: "", description: "" }
      );
      break;

    case "LIST":
      if (state.selectedProjects == null && !state.inAboutUs) {
        dom.confirmationModal.style.display = "flex";
        handlers.showListScreen();
      } else {
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