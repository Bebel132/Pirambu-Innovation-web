import { api } from "../../../assets/apiHelper.js";

export async function renderEventsList() {
  const response = await api("events/published");
  const events = response?.data || [];

  const eventsListContainer = document.querySelector(".events-list");
  if (!eventsListContainer) return;

  eventsListContainer.innerHTML = "";

  for (const event of events) {
    const item = document.createElement("li");
    item.classList.add("events_list-item", "item");

    const titleSpan = document.createElement("span");
    titleSpan.textContent = event.title;
    item.appendChild(titleSpan);

    if (event.hasFile) {
      const res = await api(`events/${event.id}/file`);
      if (res?.ok && res.data) {
        item.style.backgroundImage = `url(${URL.createObjectURL(res.data)})`;
      }
    }

    item.onclick = () => {
      window.location.href = `pages/visitor/eventos-details.html?id=${event.id}`;
    };

    eventsListContainer.appendChild(item);
  }
}
