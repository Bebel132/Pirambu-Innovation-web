export const state = {
  selectedProjects: null,
  lastTransientPreview: { projects: null },
  listLength: 0,

  inAboutUs: false,

  screenStack: [],
  currentScreen: "LIST",
};

export function setSelectedProjects(projects) {
  state.selectedProjects = projects;
}

export function clearSelectedProjects() {
  state.selectedProjects = null;
}