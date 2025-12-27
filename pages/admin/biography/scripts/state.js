export const state = {
  selectedProjects: null,
  lastTransientPreview: { projects: null },

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