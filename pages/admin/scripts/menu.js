function initMenu(items) {
    const sidebar_menu = document.querySelector(".sidebar_menu")
    const userBtn = document.querySelector(".user-btn")
    const ul = document.createElement("ul")
    
    ul.classList.add("menu")

    items.forEach(e => {
        const li = document.createElement("li")
        li.classList.add("menu_item")

        const btn = document.createElement("button")
        btn.classList.add("menu-item_btn")
        e.active != undefined ? btn.classList.add("active") : undefined
        
        const span = document.createElement("span")
        span.classList.add("material-symbols-outlined")
        span.classList.add("menu-item_icon")

        span.textContent = e.icon

        btn.appendChild(span)
        btn.appendChild(document.createTextNode(e.label))
        li.appendChild(btn)
        ul.appendChild(li)

        btn.onclick = () => {
            window.location = e.file
        }
    })
    
    sidebar_menu.appendChild(ul)

    userBtn.onclick = () => window.location = "user.html"
}

export { initMenu }