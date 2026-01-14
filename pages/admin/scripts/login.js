import { API_URL } from "./../../../assets/config.js";

async function initLogin() {
        const loading = document.querySelector(".loading")
        const unauthorized = document.querySelector("#unauthorized")
        
        const googleBtn = document.querySelector("#google")
        const microsoftBtn = document.querySelector("#microsoft")

        loading.style.display = "none"
        unauthorized.style.display = "none"

        googleBtn.onclick = () => {
            window.location.href = `${API_URL}/auth/login`
        }

        microsoftBtn.onclick = () => {
            window.location.href = `${API_URL}/auth/microsoft/login`
        }

        const teste = await fetch(`${API_URL}/auth/profile`, {
            credentials: "include"
        })

        if(teste.ok) {
            window.location = "courses/courses.html"
        }

        const url = new URL(window.location.href);

        if(url.searchParams.get("error") === "unauthorized") {
            unauthorized.style.display = "block"
        }
}

export { initLogin }