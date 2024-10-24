const {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
} = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");
if (require("electron-squirrel-startup")) app.quit();

// Update configuration
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

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

  const windowURL = `file://${path.join(__dirname, "/pages/index.html")}`;
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



  // Updates handñlers

  autoUpdater.on("update-available", (info) => {
    updateMessage(`Update available. Current version ${app.getVersion()}`);
    let pth = autoUpdater.downloadUpdate();
    updateMessage(pth);
  });

  autoUpdater.on("update-not-available", (info) => {
    updateMessage(
      `Already at last version. Current version ${app.getVersion()}`
    );
  });

  autoUpdater.on("update-downloaded", (info) => {
    updateMessage(`Update downloaded. Current version ${app.getVersion()}`);
  });

  autoUpdater.on("error", (info) => {
    updateMessage(info);
  });

  function updateMessage(message) {
    win.webContents.send("updateMessage", message);
  }
}

app.whenReady().then(() => {
  createWindow();
  autoUpdater.checkForUpdates();
  win.webContents.send("updateMessage", `Checking for updates! Current version ${app.getVersion()}`)
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});