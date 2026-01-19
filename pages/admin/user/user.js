import { api } from '../../../assets/apiHelper.js';

async function initUser() {
    const { data : user }  = await api("auth/profile");

    document.querySelector("#nome").textContent += user.username;
    document.querySelector("#email").textContent += user.email;
    
    if(user.picture != null) {
        document.querySelector("#imagemDePerfil").src = user.picture;
    } else {
        const userSplitedName = user.username.split(" ");
        document.querySelector("#imagemDePerfil").src = `https://ui-avatars.com/api/?name=${userSplitedName[0]}+${userSplitedName[1]}`;
    }

    document.querySelector("#logout").onclick = async () => {
        await api("auth/logout", { method: "POST", credentials: "include" });
        window.location = "/pages/admin/index.html";
    };

    document.querySelector(".user-btn").onclick = null;
}

export { initUser };