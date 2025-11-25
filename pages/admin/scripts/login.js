import { API_URL } from "./../../../assets/config.js";

async function initLogin() {
        const loading = document.querySelector(".loading")
        const login = document.querySelector(".login")
        const unauthorized = document.querySelector("#unauthorized")
        
        const loginBtn = document.querySelector("#login_btn")
        //const logoutBtn = document.querySelector("#logout-btn")

        loading.style.display = "none"
        unauthorized.style.display = "none"

        loginBtn.onclick = () => {
            window.location.href = `${API_URL}/auth/login`
        }

        // logoutBtn.onclick = async () => {
        //     loading.style.display = "flex"
        //     await fetch(`${API_URL}/auth/logout`, {method: "POST", credentials: "include"})
        //     loading.style.display = "none"
        //     location.reload();
        // }

        const teste = await fetch(`${API_URL}/auth/profile`, {
            credentials: "include"
        })

        if(teste.ok) {
            window.location = "courses.html"
        }

        const url = new URL(window.location.href);

        if(url.searchParams.get("error") === "unauthorized") {
            unauthorized.style.display = "block"
        }
}

export { initLogin }