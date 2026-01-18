import { api } from '../../../assets/apiHelper.js';

const allowedUsersList = document.querySelector("#access-list");
const deleteModal = document.querySelector("#delete-modal");
let currentUserId = null;

async function initAccess() {
    document.querySelector("#newAccess").onclick = async () => {
        let email = prompt("Adicione um novo acesso (email)");

        await api("users/allowedUsers/", {
            method: "POST",
            data: {
                email: email
            }
        })

        render()
    }

    render()
}

async function render() {
    const { data : users }  = await api("users/allowedUsers");
    allowedUsersList.innerHTML = ""

    users.forEach(user => {
        const li = document.createElement("li");
        li.classList.add("access")

        const span = document.createElement("span");
        span.textContent = user.email;

        const div = document.createElement("div");
        div.classList.add("btns");

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("deleteBtn");
        deleteBtn.innerHTML = "<span class='material-symbols-outlined'>delete</span> Excluir"

        const editBtn = document.createElement("button");
        editBtn.classList.add("editBtn");
        editBtn.innerHTML = "<span class='material-symbols-outlined'>edit</span> Editar"
        
        li.appendChild(span);
        div.appendChild(editBtn);
        div.appendChild(deleteBtn);
        li.appendChild(div);

        allowedUsersList.appendChild(li);

        editBtn.onclick = () => edit(li, user);
        
        deleteBtn.onclick = async () => {
            const { data : localUser }  = await api("auth/profile");
            localUser.email == user.email ?
                deleteModal.children[0].children[1].style.display = "block" :
                deleteModal.children[0].children[1].style.display = "none"
            deleteModal.style.display = "flex";
            currentUserId = user.id;
        }
    })

    document.querySelector("#deleteBtn").onclick = async () => {
        deleteModal.style.display = "none";
        await api(`users/allowedUsers/${currentUserId}`, {
            method: "DELETE"
        });
        
        const { data : allowedUsers }  = await api("users/allowedUsers");
        render()
        currentUserId = null;

        const { data : localUser }  = await api("auth/profile");
        let count = 0;
        allowedUsers.forEach(user => {
            if(user.email == localUser.email) {
                count++
            } 
        })

        if(count == 0) {
            await api("auth/logout", { method: "POST", credentials: "include" });
            window.location = "/pages/admin/index.html";
        }
    }

    document.querySelector("#cancel").onclick = () => {
        deleteModal.style.display = "none";
    }
}

const edit = (li, user) => {
    li.innerHTML = "";
    li.onclick = null;

    const input = document.createElement("input");
    input.classList.add("input-email")
    input.type = "email"
    input.value = user.email;
    
    const div = document.createElement("div");
    div.classList.add("btns");

    const save = document.createElement("button");
    save.classList.add("btnSave");
    save.innerHTML = "<span class='material-symbols-outlined'>save</span> Salvar"

    const cancel = document.createElement("button");
    cancel.classList.add("btnCancel");
    cancel.innerHTML = "<span class='material-symbols-outlined'>close</span> Cancelar"
    
    li.appendChild(input)
    div.appendChild(cancel)
    div.appendChild(save)
    li.appendChild(div)
    input.focus();

    cancel.onclick = e => {
        e.stopPropagation();
        li.innerHTML = "";

        const span = document.createElement("span");
        span.textContent = user.email;
        
        const div = document.createElement("div");
        div.classList.add("btns");

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("deleteBtn");
        deleteBtn.innerHTML = "<span class='material-symbols-outlined'>delete</span> Excluir";

        const editBtn = document.createElement("button");
        editBtn.classList.add("editBtn");
        editBtn.innerHTML = "<span class='material-symbols-outlined'>edit</span> Editar";
        
        li.appendChild(span);
        div.appendChild(editBtn);
        div.appendChild(deleteBtn);
        li.appendChild(div);

        editBtn.onclick = () => edit(li, user);
        deleteBtn.onclick = () => {
            deleteModal.style.display = "flex";
        }
    }

    save.onclick = async e => {
        e.stopPropagation();
        await api(`users/allowedUsers/${user.id}`, {
            method: "PUT",
            data: {
                email: input.value
            }
        });
        
        li.innerHTML = "";

        const span = document.createElement("span");
        span.textContent = input.value;
        
        const div = document.createElement("div");
        div.classList.add("btns");

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("deleteBtn");
        deleteBtn.innerHTML = "<span class='material-symbols-outlined'>delete</span> Excluir";

        const editBtn = document.createElement("button");
        editBtn.classList.add("editBtn");
        editBtn.innerHTML = "<span class='material-symbols-outlined'>edit</span> Editar";
        
        li.appendChild(span);
        div.appendChild(editBtn);
        div.appendChild(deleteBtn);
        li.appendChild(div);

        editBtn.onclick = () => edit(li, user);
        deleteBtn.onclick = () => {
            deleteModal.style.display = "flex";
        }

        render()
    }
}

export { initAccess };