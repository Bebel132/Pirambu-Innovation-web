import { api } from "../../../assets/apiHelper.js";

export async function renderAboutUs() {
    const response = await api("biography");
    const aboutUs = response?.data || [];

    if(aboutUs.hasFile) {
        const res = await api(`biography/file`);
        if (res?.ok && res.data) {
            const blobUrl = URL.createObjectURL(res.data);
            const aboutUsImage = document.querySelector(".aboutUs-image");
            aboutUsImage.src = blobUrl;
        }
    }

    const aboutUsText = document.querySelector(".aboutUs-text");
    if(aboutUsText) {
        aboutUsText.textContent = aboutUs.description || "";
    }
}