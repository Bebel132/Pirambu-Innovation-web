export const state = {
  selectedEvents: null,
  lastTransientPreview: { events: null },

  screenStack: [],
  currentScreen: "LIST",
};

export function setSelectedEvents(events) {
  state.selectedEvents = events;
}

export function clearSelectedEvents() {
  state.selectedEvents = null;
}