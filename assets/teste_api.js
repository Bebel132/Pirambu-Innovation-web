import { API_URL } from "./config.js";

document.querySelector(".loading").style.display = "flex"

fetch(`${API_URL}/teste`)
    .then(() => {
        document.querySelector(".loading").style.display = "none"
    });