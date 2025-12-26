import { api } from "../../../assets/apiHelper.js";

export async function renderEventsList() {
    const response = await api("events/published");
    const events = response?.data || [];

    const eventsListContainer = document.querySelector(".events-list");
    if (!eventsListContainer) return;

    // Limpa container (segurança)
    eventsListContainer.innerHTML = "";

    for (const course of events) {
        const item = document.createElement("li");
        item.classList.add("events_list-item", "item");

        // Título
        const titleSpan = document.createElement("span");
        titleSpan.textContent = course.title;
        item.appendChild(titleSpan);

        // Imagem do evento (se existir)
        if (course.hasFile) {
            const res = await api(`events/${course.id}/file`);
            if (res?.ok && res.data) {
                const blobUrl = URL.createObjectURL(res.data);
                item.style.backgroundImage = `url(${blobUrl})`;
            }
        } else {
            item.style.backgroundColor = "var(--color-gray)";
        }

        // Clique → página do evento
        item.addEventListener("click", () => {
            const url = new URL('/pages/visitor/evento.html', window.location.origin);
            url.searchParams.set('id', course.id);
            window.location.href = url.toString();
        });

        eventsListContainer.appendChild(item);
    }
}