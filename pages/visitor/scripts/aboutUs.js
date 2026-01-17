import { api } from "../../../assets/apiHelper.js";
import { renderMarkdown } from "../../../assets/markdown.js";

export async function renderAboutUs() {
  const response = await api("biography");
  const aboutUs = response?.data || {};

  /* TEXTO PRINCIPAL */
  const mainText = document.querySelector(".aboutUs-text");
  if (mainText) {
    mainText.innerHTML = renderMarkdown(aboutUs.description || "");
  }

  /* TEXTO SECUNDÁRIO */
  const secondaryText = document.getElementById("aboutUs-secondary-text");
  if (secondaryText) {
    secondaryText.innerHTML = renderMarkdown(
      aboutUs.secondary_description || ""
    );
  }

  /* IMAGEM ÚNICA */
  const image = document.getElementById("aboutUs-image");
  if (!image) return;

  if (aboutUs.image?.url) {
    image.src = aboutUs.image.url;
  } else if (aboutUs.hasFile) {
    const imageRes = await api("biography/file");
    if (imageRes?.ok && imageRes.data) {
      image.src = URL.createObjectURL(imageRes.data);
    }
  }
}
