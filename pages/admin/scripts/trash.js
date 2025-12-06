import { api } from '../../../assets/apiHelper.js';

const trashContainer = document.querySelector(".trash-container");
const coursesContainer = document.querySelector(".coursesTrash");
const listContainer = document.querySelector(".list");
let coursesList = [];

async function renderTrashList() {
    coursesList = await api("courses/deactivated");

    if(coursesList.data.length > 0) {
        const courseItem = document.createElement("div");
        courseItem.classList.add("item");
        courseItem.id = "cursos"

        const titleSpan = document.createElement("span");
        titleSpan.append("Cursos");
        courseItem.append(titleSpan);
        listContainer.appendChild(courseItem)
    }

    document.querySelectorAll(".item").forEach(item => {
        item.onclick = () => {
            if(item.id == "cursos") {
                renderCoursesList()
                coursesContainer.style.display = "block";
            }
            trashContainer.style.display = "none";
        }
    })
}

async function renderCoursesList() {
    const listContainer = document.querySelector(".coursesList");
    
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
        }

        listContainer.appendChild(courseItem)
    });
}

export { renderTrashList }