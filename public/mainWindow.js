const { app, BrowserWindow, ipcMain, globalShortcut } = require("electron");
const path = require("path");

class MainWindow {
  window;

  constructor() {
    this.window = new BrowserWindow({
    title: "Test app"
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
  }
}
