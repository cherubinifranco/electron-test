const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { autoUpdater, AppUpdater } = require("electron-updater");

//Basic flags
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

let win;
function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 650,
    minHeight: 650,
    minWidth: 800,
    frame: true,
    titleBarStyle: "default",
    webPreferences: {
      devTools: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // const windowURL = false
  //   ? `file://${path.join(__dirname, "../build/index.html")}`
  //   : "http://localhost:3000/";
  const windowURL = `file://${path.join(__dirname, "/index.html")}`;

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
  autoUpdater.checkForUpdates();
  updateStatus("Checking for updates.");
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

/*New Update Available*/
autoUpdater.on("update-available", (info) => {
  updateStatus("Update available.");
  let pth = autoUpdater.downloadUpdate();
  updateStatus(pth);
});

autoUpdater.on("update-not-available", (info) => {
  updateStatus("No update available.");
});

/*Download Completion Message*/
autoUpdater.on("update-downloaded", (info) => {
  updateStatus("Update downloaded.");
});

autoUpdater.on("error", (info) => {
  updateStatus(info);
});


function updateStatus(status) {
  const newStatus = `${status} Current version ${app.getVersion()}`;
  console.log(win);
  win.webContents.send("status", newStatus);
}