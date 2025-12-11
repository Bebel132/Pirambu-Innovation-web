import { api } from '../../../assets/apiHelper.js';

async function initUser() {
    const { data : user }  = await api("auth/profile");

    document.querySelector("#nome").textContent += user.username;
    document.querySelector("#email").textContent += user.email;
    document.querySelector("#imagemDePerfil").src = user.picture;

    document.querySelector("#logout").onclick = async () => {
        await api("auth/logout", { method: "POST" });
        window.location = "index.html";
    };

    document.querySelector(".user-btn").onclick = null;
}

export { initUser };