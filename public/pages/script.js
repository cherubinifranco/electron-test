const { ipcRenderer } = require("electron")


const messageEl = document.getElementById("message")


ipcRenderer.on("updateMessage", updateMessage)

function updateMessage(event, message){
    messageEl.innerHTML = message
}