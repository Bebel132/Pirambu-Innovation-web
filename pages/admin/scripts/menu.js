function initMenu(items) {
    const sidebar_menu = document.querySelector(".sidebar_menu")
    const userBtn = document.querySelector(".user-btn")
    const accessActions = document.querySelector(".access-actions")
    const ul = document.createElement("ul")
    
    ul.classList.add("menu")

    items.forEach(item => {
        const li = document.createElement("li")
        li.classList.add("menu_item")

        const btn = document.createElement("button")
        btn.classList.add("menu-item_btn")
        item.active != undefined ? btn.classList.add("active") : undefined
        
        const img = document.createElement("img")
        img.src = `../../../assets/imgs/${item.label.toLowerCase()}-icone-branco.svg`
        img.style.margin = "0 3px 0 5px"
        btn.appendChild(img)
        img.style.display = "none"
        
        const span = document.createElement("span")
        span.classList.add("material-symbols-outlined")
        span.classList.add("menu-item_icon")
        span.textContent = item.icon
        btn.appendChild(span)

        if(item.active) {
            img.style.display = "block"
            span.style.display = "none"
        }

        btn.appendChild(document.createTextNode(item.label))
        li.appendChild(btn)
        ul.appendChild(li)

        btn.onclick = () => {
            window.location = item.file
        }

        btn.addEventListener("mouseenter", () => {
            img.style.display = "block"
            span.style.display = "none"
        })
        
        btn.addEventListener("mouseleave", () => {
            if(!item.active) {
                img.style.display = "none"
                span.style.display = "block"
            }
        })
    })
    
    sidebar_menu.appendChild(ul)
    console.log(accessActions, userBtn)
    
    userBtn.addEventListener("click", (e) => {
        e.stopPropagation();

        const isOpen = accessActions.style.display === "flex";

        accessActions.style.display = isOpen ? "none" : "flex";
        userBtn.style.color = isOpen ? "" : "var(--main-color)";
    })
    
    accessActions.children[0].onclick = (e) => {
        e.stopPropagation();
        window.location = "../user/user.html";
    }

    accessActions.children[1].onclick = (e) => {
        e.stopPropagation();
        window.location = "../access/access.html";
    }
}

function registerAccessActionsAutoClose() {
  const accessActions = document.querySelector(".access-actions");
  const userBtn = document.querySelector(".user-btn");

  function closeAccessActions() {
    accessActions.style.display = "none";
    userBtn.style.color = "";
  }

  document.addEventListener("click", (e) => {
    const isInAccess = e.target.closest(".access-actions");
    const isUserBtn = e.target.closest(".user-btn");

    if (!isInAccess && !isUserBtn) {
      closeAccessActions();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAccessActions();
    }
  });
}

export { initMenu, registerAccessActionsAutoClose }