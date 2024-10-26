const { ipcRenderer } = window.require("electron");


ipcRenderer.on("status", (event, status)=> {
    const statusEl = document.getElementById("status");
    statusEl.innerHTML = status
})