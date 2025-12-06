import { api } from '../../../assets/apiHelper.js';

let selected_course = null;

function autoResize(el) {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }

// Elementos da UI
const content = document.querySelector(".content");
const contentForm = document.querySelector(".contentForm");
const previewContent = document.querySelector(".previewContent");
const newBtn = document.querySelector(".newButton");
const backBtn = document.querySelectorAll(".back");
const file_preview = document.querySelector(".previewImg");
const customBtn = document.querySelector(".custom-btn");
const form = document.querySelector(".form");
const sideBarMenu = document.querySelector(".sidebar_menu");
const form_title = document.querySelector(".admin-contentForm_title");
const saveModal = document.querySelector("#save-modal");
const deleteModal = document.querySelector("#delete-modal");
const trashModal = document.querySelector("#trash-modal");

/* ============================================================
   1. FUNÇÃO: RENDERIZA LISTA DE CURSOS (RASCUNHOS + PUBLICADOS)
   ============================================================ */
async function renderCourseLists() {
    let drafts = [];
    let published = [];

    const response = await api('courses');

    response.data.forEach(course => {
        course.is_draft ? drafts.push(course) : published.push(course);
    });

    await renderCourseListUI(drafts, ".drafts_list", "draft_item");
    await renderCourseListUI(published, ".published_list", "published_item");
}

/* ============================================================
   2. FUNÇÃO: GERAR UI PARA UMA LISTA ESPECÍFICA
   ============================================================ */
async function renderCourseListUI(list, containerSelector, className) {
    const container = document.querySelector(containerSelector);
    container.innerHTML = "";

    for (const course of list) {
        const item = document.createElement("div");
        item.classList.add(className, "item");
        item.dataset.data = JSON.stringify(course);

        const titleSpan = document.createElement("span");
        titleSpan.append(course.title);
        item.append(titleSpan);

        if (course.hasFile) {
            const res = await api(`courses/${course.id}/file`);
            if (res.ok) {
                const blob = res.data;
                item.style.backgroundImage = `url(${URL.createObjectURL(blob)})`;
            }
        } else {
            item.style.backgroundColor = `var(--color-gray)`;
        }

        container.appendChild(item);
    }
}

/* ============================================================
   3. FUNÇÃO: RENDERIZA O PREVIEW DO CURSO SELECIONADO
   ============================================================ */
   
function renderMarkdown(mdText) {
    // Configurações básicas do marked
    marked.setOptions({
        breaks: true,     // converte quebras de linha simples em <br>
        gfm: true         // GitHub Flavored Markdown (tabelas, listas de tarefas, etc.)
    });

    // Converte para HTML
    const rawHtml = marked.parse(mdText || "");

    // Sanitiza o HTML (Remove scripts, eventos, etc.)
    const safeHtml = DOMPurify.sanitize(rawHtml, {
        ADD_ATTR: ['target', 'rel', 'title'],
    });

    return safeHtml;
}

async function renderPreview(course) {
    const preview_title = document.querySelector(".preview-title");
    const preview_date = document.querySelector(".preview-dates");
    const preview_description = document.querySelector(".preview-description");

    preview_title.textContent = course.title;
    preview_date.textContent = 
        `${new Date(course.start_date).toLocaleDateString()} à ${new Date(course.end_date).toLocaleDateString()}`;

    preview_description.innerHTML = renderMarkdown(course.description);

    file_preview.src = "";

    if (course.hasFile) {
        const res = await api(`courses/${course.id}/file`);
        if (res.ok) {
            file_preview.src = URL.createObjectURL(res.data);
        }
    }
}

/* ============================================================
   4. FUNÇÃO: ABRIR TELA DE EDIÇÃO COM DADOS
   ============================================================ */
async function openEditForm(course) {
    form_title.textContent = "Editar curso";

    document.querySelector("#title").value = course.title;
    document.querySelector("#start").value = course.start_date.split("T")[0];
    document.querySelector("#end").value = course.end_date.split("T")[0];
    const desc = document.querySelector("#description")
    desc.value = course.description;
    desc.addEventListener("input", () => autoResize(desc));
    
    const filePrev = document.querySelector(".custom-file_preview");
    
    if (course.hasFile) {
        const res = await api(`courses/${course.id}/file`);
        if (res.ok) {
            filePrev.src = URL.createObjectURL(res.data);
            filePrev.style.display = "block";
            customBtn.style.display = "none";
        }
    } else {
        filePrev.style.display = "none";
        customBtn.style.display = "flex";
    }
    
    showFormScreen();
    setTimeout(() => autoResize(desc), 0);
}

/* ============================================================
   5. FUNÇÃO: SALVAR CURSO (NOVO OU EDITADO)
   ============================================================ */
async function saveCourse() {
    const formData = new FormData(form);
    formData.delete("file");

    if (!selected_course) {
        // Criar novo
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
        // Atualizar existente
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
    
    resetToListScreen();
    hideSaveModal();
}

/* ============================================================
   6. FUNÇÃO: UPLOAD DE ARQUIVO
   ============================================================ */
async function uploadFileIfExists(courseId) {
    const file = document.querySelector("#file").files[0];

    if (!file) return;

    const fd = new FormData();
    fd.append("file", file);

    await api(`courses/${courseId}/upload`, {
        method: "POST",
        body: fd
    });
}

/* ============================================================
   7. FUNÇÃO: CONTROLE DAS TELAS (UI)
   ============================================================ */
function showListScreen() {
    content.style.display = "block";
    newBtn.style.display = "block";
    previewContent.style.display = "none";
    contentForm.style.display = "none";
    sideBarMenu.style.display = "block";
}

function showPreviewScreen() {
    content.style.display = "none";
    newBtn.style.display = "none";
    previewContent.style.display = "block";
    sideBarMenu.style.display = "none";
}

function showFormScreen() {
    content.style.display = "none";
    newBtn.style.display = "none";
    contentForm.style.display = "block";
    previewContent.style.display = "none";
    sideBarMenu.style.display = "block";

    const desc = document.querySelector("#description");
    selected_course != null ? desc.addEventListener("input", () => autoResize(desc)) : desc.style.height = "";
}

function showDeleteModal() {
    deleteModal.style.display = "flex";
}

function showSaveModal() {
    saveModal.style.display = "flex";
}

function showTrashModal() {
    trashModal.style.display = "flex";
}

function hideDeleteModal() {
    deleteModal.style.display = "none";
}

function hideSaveModal() {
    saveModal.style.display = "none";
}

function hideTrashModal() {
    trashModal.style.display = "none";
}

function resetToListScreen() {
    selected_course = null;
    form.reset();
    showListScreen();
    renderCourses();
}

/* ============================================================
   8. FUNÇÃO: REGISTRAR EVENTOS
   ============================================================ */
function registerEvents() {

    document.addEventListener("click", async event => {
        const item = event.target.closest(".item");
        if (!item) return;

        selected_course = JSON.parse(item.dataset.data);

        // Botões
        document.querySelector("#publish").style.display =
            selected_course.is_draft ? "flex" : "none";

        document.querySelector("#edit").style.display = "flex";

        await renderPreview(selected_course);
        showPreviewScreen();
    });

    document.querySelector("#edit").onclick = () => openEditForm(selected_course);

    document.querySelector(".openSaveModal").onclick = () => showSaveModal();

    document.querySelector("#save").onclick = async () => await saveCourse();

    document.querySelector(".openDeleteModal").onclick = () => showDeleteModal();

    document.querySelector("#delete").onclick = async () => {
        await api(`courses/deactivate/${selected_course.id}`, { method: "POST" });
        hideDeleteModal();
        showTrashModal();
        setTimeout(() => {
            hideDeleteModal();
            hideTrashModal();
            resetToListScreen();
        }, 1500)
    }
    
    document.querySelector("#publish").onclick = async () => {
        await api(`courses/publish/${selected_course.id}`, { method: "POST" });
        resetToListScreen();
    };

    document.querySelector("#file").onchange = async e => {
        const file = e.target.files[0];
        const preview = document.querySelector(".custom-file_preview");
        
        preview.src = URL.createObjectURL(file);
        preview.style.display = "block";
        customBtn.style.display = "none";
        
        await uploadFileIfExists(selected_course.id);
    };
    
    newBtn.onclick = () => {
        selected_course = null;
        form.reset();
        customBtn.style.display = "flex";
        document.querySelector(".custom-file_preview").style.display = "none";
        form_title.textContent = "Adicionar curso";
        showFormScreen();
    };
    
    backBtn.forEach(btn =>
        btn.onclick = () => resetToListScreen()
    );

    document.querySelector("#delete-back").onclick = e => {
        e.preventDefault()
        hideDeleteModal()
    };
    
    document.querySelector("#save-back").onclick = e => {
        e.preventDefault()
        hideSaveModal()
    };
}

/* ============================================================
   9. FUNÇÃO PRINCIPAL DE RENDERIZAÇÃO
   ============================================================ */
async function renderCourses() {
    await renderCourseLists();
    registerEvents();
}

export { renderCourses };