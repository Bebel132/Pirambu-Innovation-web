import { api } from '../../../assets/apiHelper.js';

const trashContainer = document.querySelector(".trash");
const coursesContainer = document.querySelector(".coursesTrash");
const newsContainer = document.querySelector(".newsTrash");
const eventsContainer = document.querySelector(".eventsTrash");
const projectsContainer = document.querySelector(".projectsTrash");
const listContainer = document.querySelector(".list");
const cleanCourses = document.querySelector("#cleanCourses");
const cleanNews = document.querySelector("#cleanNews");
const cleanEvents = document.querySelector("#cleanEvents");
const cleanProjects = document.querySelector("#cleanProjects");
const cleanAll = document.querySelector("#cleanAll");

let coursesList = [];
let newsList = [];
let eventsList = [];
let projectsList = [];

async function renderTrashList() {
    coursesList = await api("courses/deactivated");
    newsList = await api("news/deactivated");
    eventsList = await api("events/deactivated");
    projectsList = await api("projects/deactivated");
    listContainer.innerHTML = "";

    if(coursesList.data.length > 0) {
        const courseItem = document.createElement("div");
        courseItem.classList.add("item");
        courseItem.id = "cursos"

        const titleSpan = document.createElement("span");
        titleSpan.append("Cursos");
        courseItem.append(titleSpan);
        listContainer.appendChild(courseItem)
    }

    if(newsList.data.length > 0) {
        const newsItem = document.createElement("div");
        newsItem.classList.add("item");
        newsItem.id = "noticias"

        const titleSpan = document.createElement("span");
        titleSpan.append("Noticias");
        newsItem.append(titleSpan);
        listContainer.appendChild(newsItem)
    }

    if(eventsList.data.length > 0) {
        const eventsItem = document.createElement("div");
        eventsItem.classList.add("item");
        eventsItem.id = "eventos"

        const titleSpan = document.createElement("span");
        titleSpan.append("Eventos");
        eventsItem.append(titleSpan);
        listContainer.appendChild(eventsItem)
    }

    if(projectsList.data.length > 0) {
        const projectsItem = document.createElement("div");
        projectsItem.classList.add("item");
        projectsItem.id = "projetos"

        const titleSpan = document.createElement("span");
        titleSpan.append("Projetos");
        projectsItem.append(titleSpan);
        listContainer.appendChild(projectsItem)
    }

    if(listContainer.innerHTML.trim() === "") {
        document.querySelector(".trash-empty").style.display = "flex";
        cleanAll.style.display = "none";
        listContainer.style.display = "none";
    }

    document.querySelectorAll(".item").forEach(item => {
        item.onclick = () => {
            switch(item.id) {
                case "cursos":
                    renderCoursesList()
                    coursesContainer.style.display = "block";
                    break;
                case "noticias":
                    renderNewsList()
                    newsContainer.style.display = "block";
                    break;
                case "eventos":
                    renderEventsList()
                    eventsContainer.style.display = "block";
                    break;
                case "projetos":
                    renderProjectsList()
                    projectsContainer.style.display = "block";
                    break;
            }
            trashContainer.style.display = "none";
        }
    })

    cleanAll.onclick = async () => {
        if (confirm("Tem certeza que deseja esvaziar toda a lixeira?")) {
            if(coursesList.data.length > 0) {
                await api(`courses/`, { method: "DELETE" });
            }
            if(newsList.data.length > 0) {
                await api(`news/`, { method: "DELETE" });
            }
            if(eventsList.data.length > 0) {
                await api(`events/`, { method: "DELETE" });
            }
            if(projectsList.data.length > 0) {
                await api(`projects/`, { method: "DELETE" });
            }
            renderTrashList();
        }
    }
}

async function renderCoursesList() {
    const listContainer = document.querySelector(".coursesList");
    listContainer.innerHTML = "";
    
    coursesList.data.forEach(async course => {
        const courseItem = document.createElement("div");
        courseItem.classList.add("item");

        const titleSpan = document.createElement("span");
        titleSpan.append(course.title);
        courseItem.append(titleSpan);

        if (course.hasFile) {
            const res = await api(`courses/${course.id}/file`);
            if (res.ok) {
                const blob = res.data;
                courseItem.style.backgroundImage = `url(${URL.createObjectURL(blob)})`;
            }
        } else {
            courseItem.style.backgroundColor = `var(--color-gray)`;
            titleSpan.style.color = "black";
        }

        const dots = document.createElement("span");
        dots.classList.add("material-symbols-outlined");
        dots.textContent = "more_horiz";
        courseItem.append(dots);

        const div = document.createElement("div");
        div.classList.add("item-actions");

        const restoreButton = document.createElement("button");
        restoreButton.innerHTML = '<span class="material-symbols-outlined">history</span> Restaurar para rascunhos';

        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<span class="material-symbols-outlined">delete</span> Excluir permanentemente';

        div.appendChild(restoreButton);
        div.appendChild(deleteButton);
        courseItem.append(div);
        
        dots.onclick = (e) => {
            e.stopPropagation();
            div.style.display = "flex";
        };
        
        restoreButton.onclick = async (e) => {
            e.stopPropagation();
            div.style.display = "none";

            const res = await api(`courses/activate/${course.id}`, { method: "POST" });
            if (res.ok) {
                coursesList = await api("courses/deactivated");
                await renderCoursesList();
            }
        }

        deleteButton.onclick = async (e) => {
            e.stopPropagation();
            div.style.display = "none";
            
            const res = await api(`courses/${course.id}`, { method: "DELETE" });
            if (res.ok) {
                coursesList = await api("courses/deactivated");
                await renderCoursesList();
            }
        }

        cleanCourses.onclick = async () => {
            if (confirm("Tem certeza que deseja esvaziar a lixeira de cursos?")) {
                const res = await api(`courses/`, { method: "DELETE" });
                if (res.ok) {
                    coursesList = await api("courses/deactivated");
                    await renderCoursesList();
                }
            }
        }

        registerActionMenuAutoClose();

        listContainer.appendChild(courseItem);
    });
}

async function renderNewsList() {
    const listContainer = document.querySelector(".newsList");
    listContainer.innerHTML = "";

    newsList.data.forEach(async news => {
        const newsItem = document.createElement("div");
        newsItem.classList.add("item");

        const titleSpan = document.createElement("span");
        titleSpan.append(news.title);
        newsItem.append(titleSpan);

        if (news.hasFile) {
            const res = await api(`news/${news.id}/file`);
            if (res.ok) {
                const blob = res.data;
                newsItem.style.backgroundImage = `url(${URL.createObjectURL(blob)})`;
            }
        } else {
            newsItem.style.backgroundColor = `var(--color-gray)`;
            titleSpan.style.color = "black";
        }

        const dots = document.createElement("span");
        dots.classList.add("material-symbols-outlined");
        dots.textContent = "more_horiz";
        newsItem.append(dots);

        const div = document.createElement("div");
        div.classList.add("item-actions");

        const restoreButton = document.createElement("button");
        restoreButton.innerHTML = '<span class="material-symbols-outlined">history</span> Restaurar para rascunhos';

        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<span class="material-symbols-outlined">delete</span> Excluir permanentemente';

        div.appendChild(restoreButton);
        div.appendChild(deleteButton);
        newsItem.append(div);
        
        dots.onclick = (e) => {
            e.stopPropagation();
            div.style.display = "flex";
        };
        
        restoreButton.onclick = async (e) => {
            e.stopPropagation();
            div.style.display = "none";

            const res = await api(`news/activate/${news.id}`, { method: "POST" });
            if (res.ok) {
                newsList = await api("news/deactivated");
                await renderNewsList();
            }
        }

        deleteButton.onclick = async (e) => {
            e.stopPropagation();
            div.style.display = "none";

            const res = await api(`news/${news.id}`, { method: "DELETE" });
            if (res.ok) {
                newsList = await api("news/deactivated");
                await renderNewsList();
            }
        }

        cleanNews.onclick = async () => {
            if (confirm("Tem certeza que deseja esvaziar a lixeira de notícias?")) {
                const res = await api(`news/`, { method: "DELETE" });
                if (res.ok) {
                    newsList = await api("news/deactivated");
                    await renderNewsList();
                }
            }
        }

        registerActionMenuAutoClose();

        listContainer.appendChild(newsItem)
    });
}

async function renderEventsList() {
    const listContainer = document.querySelector(".eventsList");
    listContainer.innerHTML = "";

    eventsList.data.forEach(async event => {
        const eventItem = document.createElement("div");
        eventItem.classList.add("item");

        const titleSpan = document.createElement("span");
        titleSpan.append(event.title);
        eventItem.append(titleSpan);
        if (event.hasFile) {
            const res = await api(`events/${event.id}/file`);
            if (res.ok) {
                const blob = res.data;
                eventItem.style.backgroundImage = `url(${URL.createObjectURL(blob)})`;
            }
        } else {
            eventItem.style.backgroundColor = `var(--color-gray)`;
            titleSpan.style.color = "black";
        }

        const dots = document.createElement("span");
        dots.classList.add("material-symbols-outlined");
        dots.textContent = "more_horiz";
        eventItem.append(dots);

        const div = document.createElement("div");
        div.classList.add("item-actions");

        const restoreButton = document.createElement("button");
        restoreButton.innerHTML = '<span class="material-symbols-outlined">history</span> Restaurar para rascunhos';

        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<span class="material-symbols-outlined">delete</span> Excluir permanentemente';

        div.appendChild(restoreButton);
        div.appendChild(deleteButton);
        eventItem.append(div);

        
        dots.onclick = (e) => {
            e.stopPropagation();
            div.style.display = "flex";
        };
        
        restoreButton.onclick = async (e) => {
            e.stopPropagation();
            div.style.display = "none";

            const res = await api(`events/activate/${event.id}`, { method: "POST" });
            if (res.ok) {
                eventsList = await api("events/deactivated");
                await renderEventsList();
            }
        }

        deleteButton.onclick = async (e) => {
            e.stopPropagation();
            div.style.display = "none";

            const res = await api(`events/${event.id}`, { method: "DELETE" });
            if (res.ok) {
                eventsList = await api("events/deactivated");
                await renderEventsList();
            }
        }

        cleanEvents.onclick = async () => {
            if (confirm("Tem certeza que deseja esvaziar a lixeira de eventos?")) {
                const res = await api(`events/`, { method: "DELETE" });
                if (res.ok) {
                    eventsList = await api("events/deactivated");
                    await renderEventsList();
                }
            }
        }

        registerActionMenuAutoClose();

        listContainer.appendChild(eventItem)
    });
}

async function renderProjectsList() {
    const listContainer = document.querySelector(".projectsList");
    listContainer.innerHTML = "";

    projectsList.data.forEach(async project => {
        const projectItem = document.createElement("div");
        projectItem.classList.add("item");
        const titleSpan = document.createElement("span");
        titleSpan.append(project.title);
        projectItem.append(titleSpan);

        if (project.hasFile) {
            const res = await api(`projects/${project.id}/file`);
            if (res.ok) {
                const blob = res.data;
                projectItem.style.backgroundImage = `url(${URL.createObjectURL(blob)})`;
            }
        } else {
            projectItem.style.backgroundColor = `var(--color-gray)`;
            titleSpan.style.color = "black";
        }

        const dots = document.createElement("span");
        dots.classList.add("material-symbols-outlined");
        dots.textContent = "more_horiz";
        projectItem.append(dots);

        const div = document.createElement("div");
        div.classList.add("item-actions");

        const restoreButton = document.createElement("button");
        restoreButton.innerHTML = '<span class="material-symbols-outlined">history</span> Restaurar para rascunhos';

        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<span class="material-symbols-outlined">delete</span> Excluir permanentemente';

        div.appendChild(restoreButton);
        div.appendChild(deleteButton);
        projectItem.append(div);

        
        dots.onclick = (e) => {
            e.stopPropagation();
            div.style.display = "flex";
        };
        
        restoreButton.onclick = async (e) => {
            e.stopPropagation();
            div.style.display = "none";

            const res = await api(`projects/activate/${project.id}`, { method: "POST" });
            if (res.ok) {
                projectsList = await api("projects/deactivated");
                await renderProjectsList();
            }
        }

        deleteButton.onclick = async (e) => {
            e.stopPropagation();
            div.style.display = "none";

            const res = await api(`projects/${project.id}`, { method: "DELETE" });
            if (res.ok) {
                projectsList = await api("projects/deactivated");
                await renderProjectsList();
            }
        }

        cleanProjects.onclick = async () => {
            if (confirm("Tem certeza que deseja esvaziar a lixeira de projetos?")) {
                const res = await api(`projects/`, { method: "DELETE" });
                if (res.ok) {
                    projectsList = await api("projects/deactivated");
                    await renderProjectsList();
                }
            }
        }

        registerActionMenuAutoClose();

        listContainer.appendChild(projectItem)
    });
}

document.querySelectorAll(".back").forEach(btn => {
    btn.onclick = async () => {
        renderTrashList();

        trashContainer.style.display = "block";
        coursesContainer.style.display = "none";
        newsContainer.style.display = "none";
        eventsContainer.style.display = "none";
        projectsContainer.style.display = "none";
    }
})

document.querySelectorAll(".cancel").forEach(btn => {
    btn.onclick = () => {
        const modal = btn.closest(".modal");
        modal.style.display = "none";
    }
})

function registerActionMenuAutoClose() {
  function closeAllActionMenus() {
    document.querySelectorAll(".item-actions").forEach((el) => {
      el.style.display = "none";
    });
  }

  document.addEventListener("click", (e) => {
    const isInActions = e.target.closest(".item-actions");
    const isDots = e.target.closest(".material-symbols-outlined");
    if (!isInActions && !isDots) closeAllActionMenus();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllActionMenus();
  });
}

export { renderTrashList }