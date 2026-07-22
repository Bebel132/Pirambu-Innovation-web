import { api } from "../../../assets/apiHelper.js";
import { renderMarkdown } from "../../../assets/markdown.js";
import { API_URL } from "../../../assets/config.js";

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
    document.getElementById("projectImage").src = `${API_URL}/projects/${project.id}/file`;
  }
}

document.addEventListener("DOMContentLoaded", loadProjectDetails);
