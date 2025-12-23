export const state = {
  selectedCourse: null,
  lastTransientPreview: { course: null },

  screenStack: [],
  currentScreen: "LIST",
};

export function setSelectedCourse(course) {
  state.selectedCourse = course;
}

export function clearSelectedCourse() {
  state.selectedCourse = null;
}