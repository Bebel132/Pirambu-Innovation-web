import { showPreviewScreen } from "./scripts/ui/preview.js";
import { openEditForm } from "./scripts/ui/form.js";
import { renderNewsLists, registerActionMenuAutoClose } from "./scripts/ui/list.js";
import { registerEvents, showListScreen } from "./scripts/events.js";
import { dom } from "./scripts/dom.js";
import { pushScreen } from "./scripts/navigation.js";

async function onEditFromList(news) {
  await openEditForm(news);
  pushScreen("FORM");
}

function onDeleteFromList() {
  dom.deleteModal.style.display = "flex";
}

export async function renderNews() {
  showListScreen();

  await renderNewsLists({
    onEdit: onEditFromList,
    onDelete: onDeleteFromList,
  });

  registerActionMenuAutoClose();

  registerEvents({
    renderNewsLists: async () =>
      renderNewsLists({
        onEdit: onEditFromList,
        onDelete: onDeleteFromList,
      }),
  });
}