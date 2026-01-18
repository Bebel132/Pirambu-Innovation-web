export const state = {
  selectedCourse: null,
  lastTransientPreview: { course: null },
  isEdited: false,
  listLength: 0,
  screenStack: [],
  currentScreen: "LIST",
};

export function setSelectedCourse(course) {
  state.selectedCourse = course;
}

export function clearSelectedCourse() {
  state.selectedCourse = null;
}