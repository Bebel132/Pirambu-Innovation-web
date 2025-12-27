import { showPreviewScreen } from "./scripts/ui/preview.js";
import { openEditForm } from "./scripts/ui/form.js";
import { renderProjectsLists, registerActionMenuAutoClose } from "./scripts/ui/list.js";
import { registerProjects, showListScreen } from "./scripts/events.js";
import { dom } from "./scripts/dom.js";
import { pushScreen } from "./scripts/navigation.js";

async function onEditFromList(projects) {
  pushScreen("PREVIEW");
  await showPreviewScreen(projects);
}

function onDeleteFromList() {
  dom.deleteModal.style.display = "flex";
}

export async function renderBiography() {
  showListScreen();

  await renderProjectsLists({
    onEdit: onEditFromList,
    onDelete: onDeleteFromList,
  });

  registerActionMenuAutoClose();

  registerProjects({
    renderProjectsLists: async () =>
      renderProjectsLists({
        onEdit: onEditFromList,
        onDelete: onDeleteFromList,
      }),
  });
}