import { api } from "../../../assets/apiHelper.js";
import { renderMarkdown } from "../../../assets/markdown.js";

async function loadCourseDetails() {
  const params = new URLSearchParams(window.location.search);
  const courseId = params.get("id");

  if (!courseId) return;

  const response = await api(`courses/${courseId}`);
  const course = response?.data;

  if (!course) return;

  const titleEl = document.getElementById("courseTitle");
  const descEl = document.getElementById("courseDescription");
  const dateEl = document.getElementById("courseDate");
  const imageEl = document.getElementById("courseImage");

  if (titleEl) {
    titleEl.textContent = course.title || "";
  }

  // Ta com markBaixo
  if (descEl) {
    descEl.innerHTML = renderMarkdown(course.description || "");
  }

  if (course.startDate && course.endDate && dateEl) {
    dateEl.textContent = `${course.startDate} à ${course.endDate}`;
  }

  if (course.hasFile && imageEl) {
    const imgRes = await api(`courses/${course.id}/file`);
    if (imgRes?.ok && imgRes.data) {
      imageEl.src = URL.createObjectURL(imgRes.data);
    }
  }
}

document.addEventListener("DOMContentLoaded", loadCourseDetails);
