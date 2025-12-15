import { api } from '../../../assets/apiHelper.js';

let selected_course = null;

// resize do textarea
function autoResize(el) {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
}

const content = document.querySelector(".content");
const contentForm = document.querySelector(".contentForm");
const previewContent = document.querySelector(".previewContent");
const newBtn = document.querySelector(".newButton");
const backBtn = document.querySelectorAll(".back");
const file_preview = document.querySelector(".previewImg");
const customBtn = document.querySelector(".custom-btn");
const form = document.querySelector(".form");
const sideBarMenu = document.querySelector(".sidebar_menu");
const form_title = document.querySelector(".contentForm-title");
const saveBtn = document.querySelectorAll(".saveBtn");
const confirmationModal = document.querySelector("#confirmation-modal");
const deleteModal = document.querySelector("#delete-modal");

// controle de navegação entre as telas
const screenStack = [];
let currentScreen = null;

function pushScreen(screenName) {
    if (currentScreen) screenStack.push(currentScreen);
    currentScreen = screenName;
}

function popScreen() {
    const prev = screenStack.pop();
    currentScreen = prev || "LIST";
    return prev;
}

function goBack() {
    const previous = popScreen();

    switch (previous) {
        case "FORM":
            showFormScreen();
            break;

        case "PREVIEW":
            showPreviewScreen(
                selected_course ||
                lastTransientPreview.course ||
                { title: "", description: "" }
            );
            break;

        case "LIST":
            if(selected_course == null) {
                confirmationModal.style.display = "flex"
            } else {
                showListScreen();
            }
            break;

        default:
            selected_course = null;
            form.reset();
            showListScreen();
            renderCourseLists();
            break;
    }
}

const lastTransientPreview = { course: null };

// funções das telas
/* ----- */
async function renderCourseLists() {
    let drafts = [];
    let published = [];

    const response = await api('courses/');
    response.data.forEach(course => {
        course.is_draft ? drafts.push(course) : published.push(course);
    });

    await renderCourseListUI(drafts, ".drafts_list", "draft_item");
    await renderCourseListUI(published, ".published_list", "published_item");
}

async function renderCourseListUI(list, containerSelector, className) {
    const container = document.querySelector(containerSelector);
    container.innerHTML = "";

    for (const course of list) {
        const item = document.createElement("div");
        item.classList.add(className, "item");
        item.dataset.data = JSON.stringify(course);

        const titleSpan = document.createElement("span");
        titleSpan.append(course.title || "(Sem título)");
        item.append(titleSpan);

        const dots = document.createElement("span");
        dots.classList.add("material-symbols-outlined");
        dots.textContent = "more_horiz";
        item.append(dots);

        const div = document.createElement("div");
        div.classList.add("item-actions");

        const editButton = document.createElement("button");
        editButton.innerHTML = '<span class="material-symbols-outlined">edit</span> Editar';

        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<span class="material-symbols-outlined">delete</span> Excluir';

        div.appendChild(editButton);
        div.appendChild(deleteButton);
        item.append(div);

        if (course.hasFile) {
            const res = await api(`courses/${course.id}/file`);
            if (res.ok) {
                const blob = res.data;
                item.style.backgroundImage = `url(${URL.createObjectURL(blob)})`;
            } else {
                item.style.backgroundColor = `var(--color-gray)`;
            }
        } else {
            item.style.backgroundColor = `var(--color-gray)`;
        }

        container.appendChild(item);

        dots.onclick = e => {
            e.stopPropagation();
            div.style.display = "flex";
        }

        editButton.onclick = async e => {
            e.stopPropagation();
            div.style.display = "none";

            selected_course = JSON.parse(item.dataset.data);

            pushScreen("PREVIEW");
            await showPreviewScreen(selected_course);
        }

        deleteButton.onclick = () => {
            deleteModal.style.display = "flex";
            selected_course = JSON.parse(item.dataset.data);
        }
    }
}

function closeAllActionMenus() {
  document.querySelectorAll('.item-actions').forEach(el => {
    el.style.display = 'none';
  });
}

document.addEventListener('click', (e) => {
  const isInActions = e.target.closest('.item-actions');
  const isDots = e.target.closest('.material-symbols-outlined');
  if (!isInActions && !isDots) {
    closeAllActionMenus();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeAllActionMenus();
  }
});

function renderMarkdown(mdText) {
    marked.setOptions({ breaks: true, gfm: true });

    const rawHtml = marked.parse(mdText || "");
    const safeHtml = DOMPurify.sanitize(rawHtml, {
        ADD_ATTR: ['target', 'rel', 'title'],
    });
    return safeHtml;
}

async function renderPreview(course) {
    const preview_title = document.querySelector(".preview-title");
    const preview_date = document.querySelector(".preview-dates");
    const preview_description = document.querySelector(".preview-description");

    preview_title.textContent = course.title || "";
    try {
        const s = course.start_date ? new Date(course.start_date).toLocaleDateString() : "";
        const e = course.end_date ? new Date(course.end_date).toLocaleDateString() : "";
        preview_date.textContent = (s && e) ? `${s} à ${e}` : "";
    } catch { preview_date.textContent = ""; }

    preview_description.innerHTML = renderMarkdown(course.description || "");
    file_preview.src = "";

    if (course.hasFile && course.id) {
        const res = await api(`courses/${course.id}/file`);
        if (res.ok) file_preview.src = URL.createObjectURL(res.data);
    }
}

async function showPreviewScreen(course) {
    if (!course.id) {
        lastTransientPreview.course = course;
    }

    console.log(course)

    await renderPreview(course);

    content.style.display = "none";
    contentForm.style.display = "none";
    newBtn.style.display = "none";
    previewContent.style.display = "block";
    sideBarMenu.style.display = "none";

    const publishBtn = document.querySelector("#publish");
    const editBtn = document.querySelector("#editBtn");

    if (course.active && course.is_draft) {
        publishBtn.style.display = "flex";
        editBtn.style.display = "flex";
    }
    else if(course.active == undefined) {
        publishBtn.style.display = "flex";
        editBtn.style.display = "none";
    } else {
        publishBtn.style.display = "none";
        editBtn.style.display = "flex";
    };

}

function showListScreen() {
    currentScreen = "LIST";
    screenStack.length = 0;

    selected_course = null;
    confirmationModal.style.display = "none";

    content.style.display = "block";
    newBtn.style.display = "block";
    previewContent.style.display = "none";
    contentForm.style.display = "none";
    sideBarMenu.style.display = "block";
}

async function openEditForm(course) {
    if (course) selected_course = course;

    if(selected_course?.is_draft) {
        form_title.textContent = "Editar rascunho";
        saveBtn[0].children[1].innerHTML = "";
        saveBtn[0].children[1].textContent += "Salvar rascunho";
    } else {
        console.log("Oi")
        form_title.textContent = "Editar curso";
        saveBtn[0].children[1].innerHTML = "";
        saveBtn[0].children[1].textContent += "Salvar";
    }

    document.querySelector("#title").value = selected_course?.title || "";
    document.querySelector("#start").value =
        selected_course?.start_date?.split("T")[0] || "";
    document.querySelector("#end").value =
        selected_course?.end_date?.split("T")[0] || "";

    const desc = document.querySelector("#description");
    desc.value = selected_course?.description || "";
    
    const filePrev = document.querySelector(".custom-file_preview");
    
    if (selected_course?.hasFile && selected_course.id) {
        const res = await api(`courses/${selected_course.id}/file`);
        if (res.ok) {
            filePrev.src = URL.createObjectURL(res.data);
            filePrev.style.display = "block";
            customBtn.style.display = "none";
        }
    } else {
        filePrev.style.display = "none";
        customBtn.style.display = "flex";
    }
    
    pushScreen("FORM");
    showFormScreen("edit");
    desc.addEventListener("input", () => autoResize(desc));
    setTimeout(() => autoResize(desc), 0);
}

function showFormScreen(action) {
    content.style.display = "none";
    newBtn.style.display = "none";
    contentForm.style.display = "block";
    previewContent.style.display = "none";
    sideBarMenu.style.display = "block";
    
    if (action == "new") {
        saveBtn[0].children[1].textContent = "Salvar rascunho";
    }
}

/* ----- */

// funções que chamam a api
/* ----- */
async function saveCourse() {
    const formData = new FormData(form);
    formData.delete("file");

    for (const [key, value] of formData.entries()) {
        if (value instanceof File) continue;

        if (key === 'description') continue;
        
        const str = (typeof value === 'string') ? value.trim() : String(value ?? '').trim();
        if (str.length === 0) {
            alert("preencha o formulário corretamente.");
            return;
        }
    }
    if (!selected_course) {
        console.log("Oi")
        const res = await api("courses/", {
            method: "POST",
            data: {
                title: formData.get("title"),
                description: formData.get("description"),
                start_date: formData.get("start_date"),
                end_date: formData.get("end_date"),
                is_draft: true
            }
        });

        selected_course = res.data;
        await uploadFileIfExists(selected_course.id);
    } else {
        await api(`courses/${selected_course.id}`, {
            method: "PUT",
            data: {
                title: formData.get("title"),
                description: formData.get("description"),
                start_date: formData.get("start_date"),
                end_date: formData.get("end_date"),
                is_draft: selected_course.is_draft
            }
        });
    }

    confirmationModal.style.display = "none"
    lastTransientPreview.course = null;
    selected_course = null;
    form.reset();
    showListScreen();
    await renderCourseLists();
}

async function uploadFileIfExists(courseId) {
    const fileInput = document.querySelector("#file");
    if (!fileInput) return;
    const file = fileInput.files[0];
    if (!file) return;
    if (!courseId) return;

    const fd = new FormData();
    fd.append("file", file);

    await api(`courses/${courseId}/upload`, {
        method: "POST",
        body: fd
    });
}
/* ----- */

// registro de eventos
function registerEvents() {
    /* botão editar na preview */
    const editBtn = document.querySelector("#editBtn");
    if (editBtn) {
        editBtn.onclick = async () => {
            await openEditForm(selected_course);
        };
    }

    /* salvar */
    if (saveBtn) saveBtn.forEach(btn => btn.onclick = async () => await saveCourse());

    /* preview do formulário - novo registro */
    const previewBtn = document.querySelector("#previewBtn");
    if (previewBtn) {
        previewBtn.onclick = () => {
            const formData = new FormData(form);

            const new_course = {
                title: formData.get("title"),
                description: formData.get("description"),
                start_date: formData.get("start_date"),
                end_date: formData.get("end_date"),
                is_draft: true,
                hasFile: false
            };

            lastTransientPreview.course = new_course;

            pushScreen("PREVIEW");
            showPreviewScreen(new_course);
        };
    }

    /* deletar curso */
    const deleteBtn = document.querySelector("#deleteBtn");
    if (deleteBtn) {
        deleteBtn.onclick = async () => {
            if (!selected_course?.id) return;

            await api(`courses/deactivate/${selected_course.id}`, {
                method: "POST"
            });
            
            deleteModal.style.display = "none";
            selected_course = null;
            form.reset();
            showListScreen();
            renderCourseLists();
        };
    }

    /* publicar */
    const publishBtn = document.querySelector("#publish");
    if (publishBtn) {
        publishBtn.onclick = async () => {
            if (!selected_course?.id) return;
            await api(`courses/publish/${selected_course.id}`, { method: "POST" });

            selected_course = null;
            form.reset();
            showListScreen();
            renderCourseLists();
        };
    }

    /* upload de arquivo */
    const fileInput = document.querySelector("#file");
    if (fileInput) {
        fileInput.onchange = async e => {
            const file = e.target.files[0];
            const preview = document.querySelector(".custom-file_preview");

            if (file) {
                preview.src = URL.createObjectURL(file);
                preview.style.display = "block";
                customBtn.style.display = "none";

                if (selected_course && selected_course.id) {
                    await uploadFileIfExists(selected_course.id);
                }
            }
        };
    }

    /* botão Novo */
    if (newBtn) {
        newBtn.onclick = () => {
            selected_course = null;
            form.reset();

            customBtn.style.display = "flex";
            document.querySelector(".custom-file_preview").style.display = "none";

            form_title.textContent = "Adicionar curso";

            pushScreen("FORM");
            showFormScreen("new");
        };
    }

    /* botões voltar */
    backBtn.forEach(btn => {
        btn.onclick = () => goBack();
    });

    const dontSaveBtn = document.querySelector("#dontSave");
    dontSaveBtn.onclick = () => showListScreen();

    document.querySelector("#cancel").onclick = () => {
        deleteModal.style.display = "none"
    }
}

async function renderCourses() {
    currentScreen = "LIST";
    showListScreen();
    await renderCourseLists();
    registerEvents();
}

export { renderCourses };