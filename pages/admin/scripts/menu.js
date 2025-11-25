function initMenu(items) {
    const sidebar_menu = document.querySelector(".sidebar_menu")

    const ul = document.createElement("ul")
    ul.classList.add("menu")

    const icons = [
        ["book_ribbon", "Cursos"], 
        ["news", "Notícias"], 
        ["event", "Eventos"], 
        ["diversity_3", "Biografia"]
    ]

    items.forEach(e => {
        const li = document.createElement("li")
        li.classList.add("menu_item")

        const btn = document.createElement("button")
        btn.classList.add("menu-item_btn")
        e[2] != undefined ? btn.classList.add("active") : undefined
        
        const span = document.createElement("span")
        span.classList.add("material-symbols-outlined")
        span.classList.add("menu-item_icon")

        span.textContent = e[0]

        btn.appendChild(span)
        btn.appendChild(document.createTextNode(e[1]))
        li.appendChild(btn)
        ul.appendChild(li)
    })
    
    sidebar_menu.appendChild(ul)
}

export { initMenu }