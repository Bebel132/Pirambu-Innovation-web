import { dom } from "../dom.js";
import { state } from "../state.js";
import { renderMarkdown } from "../../../../../assets/markdown.js";
import { getAboutUs, getAboutUsFile } from "../services/aboutUsService.js";

export async function renderAboutUsPreview(aboutUs) {
    const preview_description = document.querySelector(".aboutUs-preview-description");
    preview_description.innerHTML = renderMarkdown(aboutUs.description || "");
    dom.aboutUsFile_preview.src = "";
    
    if(aboutUs.hasFile) {
        const res = await getAboutUsFile();
        if (res.ok) dom.aboutUsFile_preview.src = URL.createObjectURL(res.data);
    }
}

export async function showAboutUsPreviewScreen(aboutUs) {
    //const aboutUs = await getAboutUs();
    state.lastTransientPreview.aboutUs = aboutUs;
    await renderAboutUsPreview(aboutUs);

    dom.content.style.display = "none";
    dom.aboutUsForm.style.display = "none";
    dom.aboutUsContentForm.style.display = "none";
    dom.newBtn.style.display = "none";
    dom.aboutUsPreview.style.display = "block";
    dom.sideBarMenu.style.display = "none";
}