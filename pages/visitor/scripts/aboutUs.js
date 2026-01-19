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

  const instagram = document.querySelector("#instagram");
  if (instagram) {
    instagram.innerHTML = aboutUs.instagram;
  }

  const whatsapp = document.querySelector("#whatsapp");
  const zapBtn = document.querySelector("#zapBtn");
  const linkZap = document.querySelector("#link-contato-zap");
  if (whatsapp && zapBtn && linkZap) {
    whatsapp.innerHTML = aboutUs.whatsapp;

    const onlyNumbers = aboutUs.whatsapp.replace(/\D/g, "");

    // Mensagem do WhatsApp
    const message = encodeURIComponent("Olá! Como posso apoiar vocês?");

    // Abre o WhatsApp no formato correto
    zapBtn.onclick = () =>
      window.open(
        `https://wa.me/55${onlyNumbers}?text=${message}`,
        "_blank"
      );

    linkZap.href = `https://wa.me/${onlyNumbers}`
  }

  const endereco = document.querySelector("#endereco");
  if (endereco) {
    endereco.innerHTML = aboutUs.endereco
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
