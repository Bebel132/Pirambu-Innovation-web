import { api } from './assets/apiHelper.js';

async function initHome() {
    await api("teste").then(() => {
        document.querySelector(".loading").style.display = "none"
    })

    const { data: courses } = await api("courses/published");
    const coursesListContainer = document.querySelector(".courses-list");

    courses.forEach(async course => {
        const item = document.createElement("div");
        item.classList.add("courses_list-item");
        item.classList.add("item");

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

        coursesListContainer.appendChild(item);

        item.onclick = () => {
            const url = new URL('/pages/visitor/course.html', window.location.origin);
            url.searchParams.set('id', course.id);
            window.location.href = url.toString()
        }
    })
}

export { initHome }