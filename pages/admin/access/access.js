import { api } from '../../../assets/apiHelper.js';

const allowedUsersList = document.querySelector("#access-list");

async function initAccess() {
    const { data : allowedUsers }  = await api("users/allowedUsers");

    document.querySelector("#newAccess").onclick = async () => {
        let email = prompt("Adicione um novo acesso (email)");

        await api("users/allowedUsers/", {
            method: "POST",
            data: {
                email: email
            }
        })

        const { data : allowedUsers }  = await api("users/allowedUsers");
        render(allowedUsers)
    }

    render(allowedUsers)
}

function render(users) {
    allowedUsersList.innerHTML = ""

    users.forEach(user => {
        const li = document.createElement("li");
        li.classList.add("access")

        const span = document.createElement("span");
        span.textContent = user.email;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "apagar";
        deleteBtn.classList.add("deleteBtn");
        
        li.appendChild(span);
        li.appendChild(deleteBtn);

        allowedUsersList.appendChild(li);

        span.onclick = () => {
            li.innerHTML = "";
            li.onclick = null;

            const input = document.createElement("input");
            input.classList.add("input-email")
            input.type = "email"
            input.value = user.email;
            
            const save = document.createElement("button");
            save.classList.add("btnSave");
            save.textContent = "salvar";

            const cancel = document.createElement("button");
            cancel.classList.add("btnCancel");
            cancel.textContent = "cancelar";
            
            li.appendChild(input)
            li.appendChild(cancel)
            li.appendChild(save)
            input.focus();

            cancel.onclick = e => {
                e.stopPropagation();
                li.innerHTML = "";

                const span = document.createElement("span");
                span.textContent = user.email;
                
                const deleteBtn = document.createElement("button");
                deleteBtn.classList.add("deleteBtn");
                deleteBtn.textContent = "apagar";
                
                li.appendChild(span);
                li.appendChild(deleteBtn);
                span.onclick = editHandler;
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
                const deleteBtn = document.createElement("button");
                deleteBtn.classList.add("deleteBtn");
                deleteBtn.textContent = "apagar";
                
                
                li.appendChild(span);
                li.appendChild(deleteBtn);
                span.onclick = editHandler;
            }
        }

        deleteBtn.onclick = async () => {
            await api(`users/allowedUsers/${user.id}`, {
                method: "DELETE"
            });
            
            const { data : allowedUsers }  = await api("users/allowedUsers");
            render(allowedUsers)
        }

        const editHandler = span.onclick;
    })
}

export { initAccess };