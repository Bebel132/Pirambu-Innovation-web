export const state = {
  selectedNews: null,
  lastTransientPreview: { news: null },
  listLength: 0,
  screenStack: [],
  currentScreen: "LIST",
};

export function setSelectedNews(news) {
  state.selectedNews = news;
}

export function clearSelectedNews() {
  state.selectedNews = null;
}