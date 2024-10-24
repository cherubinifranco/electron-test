const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const { updateElectronApp } = require('update-electron-app')
if (require('electron-squirrel-startup')) app.quit();



updateElectronApp({
  updateInterval: "20 minutes"
})
let win

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 650,
    minHeight: 650,
    minWidth: 800,
    frame: true,
    webPreferences: {
      devTools: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // const windowURL = false
  //   ? `file://${path.join(__dirname, "../build/index.html")}`
  //   : "http://localhost:3000/";

  const windowURL = `file://${path.join(__dirname, "/pages/index.html")}`
  win.loadURL(windowURL);
  ipcMain.on("closeApp", () => {
    win.close();
  });
  ipcMain.on("maxResApp", () => {
    if (win.isMaximized()) {
      win.restore();
    } else {
      win.maximize();
    }
  });
  ipcMain.on("minimizeApp", () => {
    win.minimize();
  });
}

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
