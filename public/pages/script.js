const { ipcRenderer } = require("electron")





ipcRenderer.on("updateMessage", (event, message) => updateMessage(message))

function updateMessage(message){
    console.log("Update this with", message)
    const messageEl = document.getElementById("message")
    messageEl.innerHTML = message
}