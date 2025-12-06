function initNews(draft_list, published_list) {
    const draft_container = document.querySelector(".drafts_list")
    const published_container = document.querySelector(".published_list")
    
    draft_list.forEach(e => {
        const draft = document.createElement("div")
        draft.classList.add("draft_item")
        draft.classList.add("item")
        
        const title = document.createElement("h2")
        title.append(document.createTextNode(e.title))
        
        const description = document.createElement("span")
        description.append(document.createTextNode(e.description))

        const img = document.createElement("div")
        img.classList.add("file")
        
        draft.append(img)
        draft.append(title)
        draft.append(description)

        draft_container.appendChild(draft)
    })

    published_list.forEach(e => {
        const published = document.createElement("div")
        published.classList.add("published_item")
        published.classList.add("item")
        
        const title = document.createElement("h2")
        title.append(document.createTextNode(e.title))
        
        const description = document.createElement("span")
        description.append(document.createTextNode(e.description))

        const img = document.createElement("div")
        img.classList.add("file")
        
        published.append(img)
        published.append(title)
        published.append(description)

        published_container.appendChild(published)
    })
}

export { initNews }