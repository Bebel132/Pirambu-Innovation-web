import { api } from "../../../../../assets/apiHelper.js";

export async function getAboutUs() {
  return api("biography/");
}

export async function updateAboutUs(payload) {
  return api("biography/edit", { method: "PUT", data: payload });
}

export async function uploadAboutUsFile(file) {
  const fd = new FormData();
  fd.append("file", file);

  return api("biography/upload", {
    method: "POST",
    body: fd,
  });
}

export async function getAboutUsFile() {
    return api("biography/file");
}