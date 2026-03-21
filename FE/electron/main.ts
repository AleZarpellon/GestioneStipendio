import { app, BrowserWindow, dialog } from 'electron';
import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { autoUpdater } from 'electron-updater';

let win: BrowserWindow;
let springProcess: ChildProcess;

function getResourcesPath(): string {
  return app.isPackaged
    ? path.join(process.resourcesPath, 'resources')
    : path.join(__dirname, '../resources');
}

function ensureDataDirectory(): void {
  const dataDir = path.join(os.homedir(), 'AppData', 'Local', 'GestioneStipendio');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function startSpringBoot(): Promise<void> {
  return new Promise((resolve) => {
    const resourcesPath = getResourcesPath();
    const javaPath = path.join(
      resourcesPath,
      'jre',
      'bin',
      process.platform === 'win32' ? 'java.exe' : 'java',
    );
    const jarPath = path.join(resourcesPath, 'app.jar');

    springProcess = spawn(javaPath, ['-jar', jarPath]);

    springProcess.stdout?.on('data', (data) => {
      const output = data.toString();
      console.log('Spring Boot OUT:', output);
      if (output.includes('Started') || output.includes('Tomcat started')) {
        resolve();
      }
    });

    springProcess.stderr?.on('data', (data) => {
      const output = data.toString();
      console.log('Spring Boot ERR:', output);
      if (output.includes('Started') || output.includes('Tomcat started')) {
        resolve();
      }
    });

    setTimeout(resolve, 30000);
  });
}

function createWindow(): void {
  win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  if (app.isPackaged) {
    win.loadFile(
      path.join(process.resourcesPath, 'app.asar.unpacked', 'dist', 'browser', 'index.html'),
    );
  } else {
    win.loadURL('http://localhost:4200');
  }
}

autoUpdater.on('update-available', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Aggiornamento disponibile',
    message: 'È disponibile una nuova versione. Verrà scaricata in background.',
  });
});

autoUpdater.on('update-downloaded', () => {
  dialog
    .showMessageBox({
      type: 'info',
      title: 'Aggiornamento pronto',
      message: "L'aggiornamento è pronto. L'app si riavvierà ora.",
      buttons: ['Riavvia'],
    })
    .then(() => {
      autoUpdater.quitAndInstall();
    });
});

app.whenReady().then(async () => {
  if (app.isPackaged) {
    ensureDataDirectory();
    await startSpringBoot();
    autoUpdater.checkForUpdatesAndNotify();
  }
  createWindow();
});

app.on('before-quit', () => {
  if (springProcess) springProcess.kill();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
