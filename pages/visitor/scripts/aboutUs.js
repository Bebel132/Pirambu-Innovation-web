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

  /* INSTAGRAM */
  const instagram = document.querySelector("#instagram");
  const linkInstagram = document.querySelector("#link-contato-instagram");

  if (instagram && linkInstagram && aboutUs.instagram) {
    instagram.innerHTML = aboutUs.instagram;

    // Garante link válido
    const instagramUrl = aboutUs.instagram.startsWith("http")
      ? aboutUs.instagram
      : `https://www.instagram.com/${aboutUs.instagram.replace("@", "")}`;

    linkInstagram.href = instagramUrl;
  }

  /* WHATSAPP */
  const whatsapp = document.querySelector("#whatsapp");
  const linkZap = document.querySelector("#link-contato-zap");

  if (whatsapp && linkZap && aboutUs.whatsapp) {
    whatsapp.textContent = aboutUs.whatsapp;

    const onlyNumbers = aboutUs.whatsapp.replace(/\D/g, "");
    const message = encodeURIComponent("Olá! Como posso apoiar vocês?");

    linkZap.href = `https://wa.me/55${onlyNumbers}?text=${message}`;
  }

  /* ENDEREÇO */
  const endereco = document.querySelector("#endereco");
  const linkEndereco = document.querySelector("#link-contato-endereco");

  if (endereco && linkEndereco && aboutUs.endereco) {
    endereco.textContent = aboutUs.endereco;

    const enderecoEncoded = encodeURIComponent(aboutUs.endereco);
    linkEndereco.href = `https://www.google.com/maps/search/?api=1&query=${enderecoEncoded}`;
  }

  /* IMAGEM */
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
