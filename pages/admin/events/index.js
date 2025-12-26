import { showPreviewScreen } from "./scripts/ui/preview.js";
import { openEditForm } from "./scripts/ui/form.js";
import { renderEventsLists, registerActionMenuAutoClose } from "./scripts/ui/list.js";
import { registerEvents, showListScreen } from "./scripts/events.js";
import { dom } from "./scripts/dom.js";
import { pushScreen } from "./scripts/navigation.js";

async function onEditFromList(events) {
  pushScreen("PREVIEW");
  await showPreviewScreen(events);
}

function onDeleteFromList() {
  dom.deleteModal.style.display = "flex";
}

export async function renderEvents() {
  showListScreen();

  await renderEventsLists({
    onEdit: onEditFromList,
    onDelete: onDeleteFromList,
  });

  registerActionMenuAutoClose();

  registerEvents({
    renderEventsLists: async () =>
      renderEventsLists({
        onEdit: onEditFromList,
        onDelete: onDeleteFromList,
      }),
  });
}