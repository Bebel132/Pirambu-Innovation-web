export function renderMarkdown(mdText) {
  marked.setOptions({ breaks: true, gfm: true });

  const rawHtml = marked.parse(mdText || "");
  const safeHtml = DOMPurify.sanitize(rawHtml, {
    ADD_ATTR: ["target", "rel", "title"],
  });

  return safeHtml;
}

