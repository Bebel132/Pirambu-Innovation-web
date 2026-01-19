import { dom } from "../dom.js";
import { getAboutUsFile } from "../services/aboutUsService.js";

export function autoResize(el) {
  el.style.height = "auto";
  el.style.height = el.scrollHeight + "px";
}

export function showAboutUsFormScreen() {
  dom.content.style.display = "none";
  dom.newBtn.style.display = "none";
  dom.aboutUsContentForm.style.display = "block";
  dom.aboutUsForm.style.display = "flex";
  dom.sideBarMenu.style.display = "block";
  dom.aboutUsPreview.style.display = "none";
}

export async function openAboutUsEditForm(aboutUs) {
    const desc = dom.aboutUsDescInput();
    desc.value = aboutUs?.description || "";

    const instagram = dom.aboutUsInstagramInput();
    instagram.value = aboutUs?.instagram || "";
    
    const whatsapp = dom.aboutUsWhatsappInput();
    whatsapp.value = aboutUs?.whatsapp || "";
    
    const endereco = dom.aboutUsEnderecoInput();
    endereco.value = aboutUs?.endereco || "";
    
    const filePrev = dom.aboutUsFilePreviewOnForm();
    
    if(aboutUs.hasFile) {
        const res = await getAboutUsFile();
        if (res.ok) {
            filePrev.src = URL.createObjectURL(res.data);
            filePrev.style.display = "block";
            dom.aboutUsCustomBtn.style.display = "none";
        }
    } else {
        filePrev.style.display = "none";
        dom.aboutUsCustomBtn.style.display = "flex";
    }
    
    showAboutUsFormScreen();
    
    desc.addEventListener("input", () => autoResize(desc));
    setTimeout(() => autoResize(desc), 0);
}