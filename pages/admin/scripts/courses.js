import { api } from '../../../assets/apiHelper.js';

let selected_course = null;
const content = document.querySelector(".content")
const contentForm = document.querySelector(".contentForm")
const previewContent = document.querySelector(".previewContent")
const newBtn = document.querySelector(".newButton")
const backBtn = document.querySelectorAll(".back")
const file_preview = document.querySelector(".previewImg")
const customBtn = document.querySelector(".custom-btn")
const form = document.querySelector(".form")
const sideBarMenu = document.querySelector(".sidebar_menu")
const form_title = document.querySelector(".admin-contentForm_title")

async function renderCourses() {
    let draft_list = []
    let published_list = []
    
    await api('courses').then(res => res.data.forEach(course => course.is_draft ? draft_list.push(course) : published_list.push(course)));

    const draft_container = document.querySelector(".drafts_list")
    const published_container = document.querySelector(".published_list")
    draft_container.innerHTML = ""
    published_container.innerHTML = ""
    
    draft_list.forEach(async e => {
        const draft = document.createElement("div")
        draft.classList.add("draft_item")
        draft.classList.add("item")
        
        const span = document.createElement("span")
        span.append(document.createTextNode(e.title))
        
        draft.append(span)
        draft.dataset.data = JSON.stringify(e)

        if(e.hasFile) {
            const res = await api(`courses/${e.id}/file`)
            if (res.ok) {
                const blob = res.data
                const objectURL = URL.createObjectURL(blob)
                draft.style.backgroundImage = `url(${objectURL})`
            }
        } else {
            draft.style.backgroundColor = `var(--color-gray)`
        }

        draft_container.appendChild(draft)
    })

    published_list.forEach(async e => {
        const published = document.createElement("div")
        published.classList.add("published_item")
        published.classList.add("item")
        
        const span = document.createElement("span")
        span.append(document.createTextNode(e.title))

        published.append(span)
        published.dataset.data = JSON.stringify(e)

        if(e.hasFile) {
            const res = await api(`courses/${e.id}/file`)
            if (res.ok) {
                const blob = res.data
                const objectURL = URL.createObjectURL(blob)
                published.style.backgroundImage = `url(${objectURL})`
            }
        } else {
            published.style.backgroundColor = `var(--color-gray)`
        }

        published_container.appendChild(published)
    })

    renderEvents()
}

async function renderEvents() {
    selected_course = null
    document.addEventListener("click", async (event) => {
        const item = event.target.closest(".item")
        if (!item) return
        
        selected_course = JSON.parse(item.dataset.data)

        if(selected_course.is_draft) {
            document.querySelector("#edit").style.display = "flex"
        }

        if(!selected_course.is_draft) {
            document.querySelector("#publish").style.display = "none"
            document.querySelector("#edit").style.display = "flex"
        } else {
            document.querySelector("#publish").style.display = "flex"
        }
        
        content.style.display = "none"
        newBtn.style.display = "none"
        previewContent.style.display = "block"
        sideBarMenu.style.display = "none"
        
        const preview_title = document.querySelector(".preview-title")
        const preview_date = document.querySelector(".preview-dates")
        const preview_description = document.querySelector(".preview-description")
        
        preview_title.textContent = selected_course.title
        preview_date.textContent = `${new Date(selected_course.start_date).toLocaleDateString()} à ${new Date(selected_course.end_date).toLocaleDateString()}`
        preview_description.textContent = selected_course.description

        file_preview.src = ""
        if (selected_course.hasFile) {
            const res = await api(`courses/${selected_course.id}/file`)

            if (res.ok) {
                const blob = res.data
                
                const objectURL = URL.createObjectURL(blob)
                
                file_preview.src = objectURL
            }
        }
    })

    document.querySelector("#edit").onclick = async () => {
        contentForm.style.display = "block"
        newBtn.style.display = "none"
        previewContent.style.display = "none"
        sideBarMenu.style.display = "block"

        const title_input = document.querySelector("#title")
        const start_date_input = document.querySelector("#start")
        const end_date_input = document.querySelector("#end")
        const description_input = document.querySelector("#description")
        const file_preview = document.querySelector(".custom-file_preview")

        form_title.textContent = "Editar curso"

        if (selected_course.hasFile) {
            const res = await api(`courses/${selected_course.id}/file`)

            if (res.ok) {
                const blob = res.data

                const objectURL = URL.createObjectURL(blob)

                file_preview.src = objectURL

                document.querySelector(".custom-btn").style.display = "none"
            }
        } else {
            file_preview.style.display = "none"
            document.querySelector(".custom-btn").style.display = "flex"
        }

        title_input.value = selected_course.title
        start_date_input.value = selected_course.start_date.split("T")[0]
        end_date_input.value = selected_course.end_date.split("T")[0]
        description_input.value = selected_course.description
    }

    document.querySelector("#save").onclick = async () => {
        const form = document.querySelector(".form")

        const formData = new FormData(form);
        formData.delete("file")

        

        if(selected_course == null) {
            await api("courses", {
                method: "POST",
                data: formData
            }).then(async res => {
                selected_course = res.data
                const file = document.querySelector("#file").files[0]
                if (file) {
                    const formData = new FormData()
                    formData.append("file", file)
                    await api(`courses/${selected_course.id}/upload`, {
                        method: "POST",
                        body: formData
                    })
                }
            })
        } else {
            selected_course.is_draft ?  formData.append("is_draft", "true") : formData.append("is_draft", "false")
            await api(`courses/${selected_course.id}`, {
                method: "PUT",
                data: formData
            })
        }

        contentForm.style.display = "none"
        previewContent.style.display = "none"
        content.style.display = "block"
        newBtn.style.display = "block"
        sideBarMenu.style.display = "block"

        selected_course = null
        renderCourses()
    }

    document.querySelector("#delete").onclick = async () => {
        await api(`courses/${selected_course.id}`, {
            method: "DELETE",
        })

        content.style.display = "block"
        newBtn.style.display = "block"
        contentForm.style.display = "none"
        sideBarMenu.style.display = "block"

        selected_course = null
        renderCourses()
    }

    document.querySelector("#publish").onclick = async () => {
        await api(`courses/publish/${selected_course.id}`, {
            method: "POST",
        })

        content.style.display = "block"
        newBtn.style.display = "block"
        previewContent.style.display = "none"
        sideBarMenu.style.display = "block"
        
        selected_course = null
        renderCourses()
    }

    document.querySelector("#file").onchange = async e => {
        const file = e.target.files[0]
        const file_preview = document.querySelector(".custom-file_preview")
        document.querySelector(".custom-btn").style.display = "none"
        file_preview.style.display = "block"
        file_preview.src = URL.createObjectURL(file)

        const formData = new FormData()
        formData.append("file", file)

        await api(`courses/${selected_course.id}/upload`, {
            method: "POST",
            body: formData
        })
    }
    
    newBtn.onclick = () => {
        content.style.display = "none"
        newBtn.style.display = "none"
        contentForm.style.display = "block"
        previewContent.style.display = "none"
        customBtn.style.display = "flex"
        document.querySelector(".custom-file_preview").style.display = "none"
        form_title.textContent = "Adicionar curso"
        form.reset()
    }
    
    backBtn.forEach(btn => btn.onclick = () => {
        content.style.display = "block"
        newBtn.style.display = "block"
        contentForm.style.display = "none"
        previewContent.style.display = "none"
        customBtn.style.display = "none"
        form.reset()
        sideBarMenu.style.display = "block"
        
        renderCourses()
    })
}

export { renderCourses }