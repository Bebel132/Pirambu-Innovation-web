import { showPreviewScreen } from "./scripts/ui/preview.js";
import { openEditForm } from "./scripts/ui/form.js";
import { renderCourseLists, registerActionMenuAutoClose } from "./scripts/ui/list.js";
import { registerEvents, showListScreen } from "./scripts/events.js";
import { dom } from "./scripts/dom.js";
import { pushScreen } from "./scripts/navigation.js";

async function onEditFromList(course) {
  pushScreen("PREVIEW");
  await showPreviewScreen(course);
}

function onDeleteFromList() {
  dom.deleteModal.style.display = "flex";
}

export async function renderCourses() {
  showListScreen();

  await renderCourseLists({
    onEdit: onEditFromList,
    onDelete: onDeleteFromList,
  });

  registerActionMenuAutoClose();

  registerEvents({
    renderCourseLists: async () =>
      renderCourseLists({
        onEdit: onEditFromList,
        onDelete: onDeleteFromList,
      }),
  });
}
