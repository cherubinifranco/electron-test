


const statusEl = document.getElementById("status")
console.log(statusEl)


export function updateStatus(message){
    statusEl.innerHTML = message
}

module.exports = {
    updateStatus
}