const content = document.querySelector(".content")
const newContent = document.querySelector(".newContent")
const newBtn = document.querySelector(".newButton")

newBtn.onclick = () => {
    content.style.display = "none"
    newBtn.style.display = "none"
    newContent.style.display = "block"
}

document.querySelector("#back").onclick = () => {
    content.style.display = "block"
    newBtn.style.display = "block"
    newContent.style.display = "none"
}