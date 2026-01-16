import { marked } from "https://cdn.jsdelivr.net/npm/marked@12.0.2/lib/marked.esm.js";
import DOMPurify from "https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.es.js";

marked.setOptions({
  breaks: true,
  gfm: true,
});

export function renderMarkdown(mdText = "") {
  const rawHtml = marked.parse(mdText);
  const safeHtml = DOMPurify.sanitize(rawHtml, {
    ADD_ATTR: ["target", "rel", "title"],
  });

  return safeHtml;
}
