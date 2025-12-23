export const state = {
  selectedNews: null,
  lastTransientPreview: { news: null },

  screenStack: [],
  currentScreen: "LIST",
};

export function setSelectedNews(news) {
  state.selectedNews = news;
}

export function clearSelectedNews() {
  state.selectedNews = null;
}