import { app, BrowserWindow, dialog } from 'electron';
import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { autoUpdater } from 'electron-updater';

// ─── Globals ─────────────────────────────────────────────────────────────────

let mainWin: BrowserWindow | null = null;
let loadingWin: BrowserWindow | null = null;
let springProcess: ChildProcess | null = null;

// ─── Paths ───────────────────────────────────────────────────────────────────

function getResourcesPath(): string {
  return app.isPackaged
    ? path.join(process.resourcesPath, 'resources')
    : path.join(__dirname, '../resources');
}

// ─── Data directory ──────────────────────────────────────────────────────────

function ensureDataDirectory(): void {
  const dataDir = path.join(os.homedir(), 'AppData', 'Local', 'GestioneStipendio');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// ─── Loading window ──────────────────────────────────────────────────────────

function createLoadingWindow(): void {
  loadingWin = new BrowserWindow({
    width: 420,
    height: 220,
    frame: false,
    resizable: false,
    center: true,
    alwaysOnTop: true,
    webPreferences: { contextIsolation: true },
  });

  loadingWin.loadURL(`data:text/html,
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8"/>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', sans-serif;
          background: #1a1a2e;
          color: #e0e0e0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          gap: 16px;
          user-select: none;
        }
        h2 { font-size: 15px; font-weight: 500; color: #a0aec0; }
        #msg { font-size: 13px; color: #718096; min-height: 18px; }
        .bar-wrap {
          width: 280px; height: 4px;
          background: #2d3748; border-radius: 4px; overflow: hidden;
        }
        .bar {
          height: 100%; width: 0%;
          background: linear-gradient(90deg, #667eea, #764ba2);
          border-radius: 4px;
          transition: width 0.3s ease;
        }
      </style>
    </head>
    <body>
      <h2>GestioneStipendio</h2>
      <div id="msg">Avvio in corso...</div>
      <div class="bar-wrap"><div class="bar" id="bar"></div></div>
    </body>
    </html>
  `);
}

function setLoadingMessage(message: string, percent?: number): void {
  if (!loadingWin) return;
  const safeMsg = message.replace(/'/g, "\\'");
  loadingWin.webContents
    .executeJavaScript(
      `
    document.getElementById('msg').innerText = '${safeMsg}';
    ${percent !== undefined ? `document.getElementById('bar').style.width = '${percent}%';` : ''}
  `,
    )
    .catch(() => {});
}

function closeLoadingWindow(): void {
  if (loadingWin && !loadingWin.isDestroyed()) {
    loadingWin.close();
    loadingWin = null;
  }
}

// ─── Auto updater ─────────────────────────────────────────────────────────────

function checkForUpdate(): Promise<boolean> {
  return new Promise((resolve) => {
    let updateFound = false;
    let resolved = false;

    const done = (value: boolean) => {
      if (!resolved) {
        resolved = true;
        resolve(value);
      }
    };

    autoUpdater.on('checking-for-update', () => {
      console.log('Checking for update...');
      setLoadingMessage('Controllo aggiornamenti...');
    });

    autoUpdater.on('update-not-available', () => {
      console.log('No update available.');
      done(false);
    });

    autoUpdater.on('update-available', (info) => {
      console.log('Update available:', info.version);
      updateFound = true;
      setLoadingMessage(`Aggiornamento ${info.version} trovato. Download in corso...`, 0);
    });

    autoUpdater.on('download-progress', (progress) => {
      const pct = Math.round(progress.percent);
      setLoadingMessage(`Download: ${pct}%`, pct);
    });

    autoUpdater.on('update-downloaded', (info) => {
      console.log('Update downloaded:', info.version);
      setLoadingMessage('Aggiornamento pronto. Riavvio...', 100);
      setTimeout(() => {
        autoUpdater.quitAndInstall(true, true);
      }, 1500);
      // Non chiamiamo done(true) — l'app si riavvierà da sola
    });

    autoUpdater.on('error', (err) => {
      console.error('AutoUpdater error:', err);
      if (!updateFound) done(false); // procedi normalmente se non aveva ancora trovato nulla
    });

    // Timeout di sicurezza: se il check non risponde entro 15s, procedi
    setTimeout(() => {
      if (!updateFound) {
        console.warn('Update check timed out, proceeding normally.');
        done(false);
      }
    }, 15000);

    autoUpdater.checkForUpdates().catch((err) => {
      console.error('checkForUpdates() error:', err);
      done(false);
    });
  });
}

// ─── Spring Boot ─────────────────────────────────────────────────────────────

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

    setLoadingMessage('Avvio backend...');
    console.log('Starting Spring Boot:', jarPath);

    springProcess = spawn(javaPath, ['-jar', jarPath]);

    const onData = (data: Buffer) => {
      const output = data.toString();
      console.log('Spring Boot:', output.trim());
      if (output.includes('Started') || output.includes('Tomcat started')) {
        resolve();
      }
    };

    springProcess.stdout?.on('data', onData);
    springProcess.stderr?.on('data', onData);

    springProcess.on('error', (err) => {
      console.error('Spring Boot process error:', err);
      dialog.showErrorBox('Errore avvio backend', err.message);
      resolve(); // procedi comunque, l'app mostrerà un errore di connessione
    });

    // Timeout massimo di attesa
    setTimeout(resolve, 30000);
  });
}

// ─── Main window ─────────────────────────────────────────────────────────────

function createMainWindow(): void {
  mainWin = new BrowserWindow({
    width: 1280,
    height: 800,
    show: false, // mostrata solo dopo il caricamento
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  if (app.isPackaged) {
    mainWin.loadFile(
      path.join(process.resourcesPath, 'app.asar.unpacked', 'dist', 'browser', 'index.html'),
    );
  } else {
    mainWin.loadURL('http://localhost:4200');
  }

  mainWin.once('ready-to-show', () => {
    closeLoadingWindow();
    mainWin?.show();
  });

  mainWin.on('closed', () => {
    mainWin = null;
  });
}

// ─── App lifecycle ───────────────────────────────────────────────────────────

app.whenReady().then(async () => {
  createLoadingWindow();

  if (app.isPackaged) {
    ensureDataDirectory();

    const hasUpdate = await checkForUpdate();

    if (!hasUpdate) {
      await startSpringBoot();
      createMainWindow();
    }
    // se hasUpdate === true, autoUpdater.quitAndInstall() gestirà il riavvio
  } else {
    // Sviluppo: salta update e Spring Boot
    closeLoadingWindow();
    createMainWindow();
  }
});

app.on('before-quit', () => {
  if (springProcess) {
    springProcess.kill();
    springProcess = null;
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWin === null) createMainWindow();
});
