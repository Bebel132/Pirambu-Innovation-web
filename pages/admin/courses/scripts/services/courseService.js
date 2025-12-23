import { api } from "../../../../../assets/apiHelper.js";

export async function listCourses() {
  return api("courses/");
}

export async function getCourseFile(courseId) {
  return api(`courses/${courseId}/file`);
}

export async function createCourse(payload) {
  return api("courses/", { method: "POST", data: payload });
}

export async function updateCourse(courseId, payload) {
  return api(`courses/${courseId}`, { method: "PUT", data: payload });
}

export async function uploadCourseFile(courseId, file) {
  const fd = new FormData();
  fd.append("file", file);

  return api(`courses/${courseId}/upload`, {
    method: "POST",
    body: fd,
  });
}

export async function deactivateCourse(courseId) {
  return api(`courses/deactivate/${courseId}`, { method: "POST" });
}

export async function publishCourse(courseId) {
  return api(`courses/publish/${courseId}`, { method: "POST" });
}