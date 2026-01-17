import { api } from "../../../assets/apiHelper.js";
import { renderMarkdown } from "../../../assets/markdown.js";

async function loadProjectDetails() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) return;

  const res = await api(`projects/${id}`);
  const project = res?.data;
  if (!project) return;

  document.getElementById("projectTitle").textContent = project.title || "";

  document.getElementById("projectDescription").innerHTML =
    renderMarkdown(project.description || "");

  if (project.hasFile) {
    const imgRes = await api(`projects/${id}/file`);
    if (imgRes?.ok && imgRes.data) {
      document.getElementById("projectImage").src =
        URL.createObjectURL(imgRes.data);
    }
  }
}

document.addEventListener("DOMContentLoaded", loadProjectDetails);
