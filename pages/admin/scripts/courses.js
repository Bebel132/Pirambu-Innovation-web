function initCourses(draft_list, published_list) {
    const draft_container = document.querySelector(".drafts_list")
    const published_container = document.querySelector(".published_list")
    
    draft_list.forEach(e => {
        const draft = document.createElement("div")
        draft.classList.add("draft_item")
        draft.classList.add("item")
        
        const span = document.createElement("span")
        span.append(document.createTextNode(e))
        
        draft.append(span)

        draft_container.appendChild(draft)
    })

    published_list.forEach(e => {
        const published = document.createElement("div")
        published.classList.add("draft_item")
        published.classList.add("item")
        
        const span = document.createElement("span")
        span.append(document.createTextNode(e))

        published.append(span)

        published_container.appendChild(published)
    })
}

export { initCourses }