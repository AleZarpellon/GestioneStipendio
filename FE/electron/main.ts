import { app, BrowserWindow, dialog } from 'electron';
import { spawn, ChildProcess } from 'child_process';
import { createWriteStream, WriteStream } from 'fs';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { autoUpdater } from 'electron-updater';

// ─── Globals ─────────────────────────────────────────────────────────────────

let mainWin: BrowserWindow | null = null;
let loadingWin: BrowserWindow | null = null;
let springProcess: ChildProcess | null = null;
let logStream: WriteStream;

// ─── Logger ───────────────────────────────────────────────────────────────────

function initLogger(): void {
  const logDir = path.join(os.homedir(), 'AppData', 'Local', 'GestioneStipendio');
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

  const logPath = path.join(logDir, 'app.log');
  logStream = createWriteStream(logPath, { flags: 'a' });

  const originalLog = console.log.bind(console);
  const originalWarn = console.warn.bind(console);
  const originalError = console.error.bind(console);

  const write = (level: string, args: any[]) => {
    const line = `[${new Date().toISOString()}] [${level}] ${args.map(String).join(' ')}\n`;
    logStream.write(line);
  };

  console.log = (...args) => {
    write('INFO', args);
    originalLog(...args);
  };
  console.warn = (...args) => {
    write('WARN', args);
    originalWarn(...args);
  };
  console.error = (...args) => {
    write('ERROR', args);
    originalError(...args);
  };

  // Cattura TUTTE le promise rejection non gestite — mostra stack completo
  process.on('unhandledRejection', (reason: any, promise) => {
    console.error('UnhandledRejection at:', promise);
    console.error('Reason:', reason?.stack ?? reason);
  });

  // Cattura eccezioni sincrone non gestite
  process.on('uncaughtException', (err) => {
    console.error('UncaughtException:', err.stack ?? err);
  });
}

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

function createLoadingWindow(): Promise<void> {
  return new Promise((resolve) => {
    loadingWin = new BrowserWindow({
      width: 420,
      height: 220,
      frame: false,
      resizable: false,
      center: true,
      alwaysOnTop: true,
      show: false,
      backgroundColor: '#1a1a2e',
      webPreferences: { contextIsolation: true },
    });

    loadingWin.loadFile(path.join(__dirname, 'loading.html'));

    loadingWin.once('ready-to-show', () => {
      loadingWin?.show();
      resolve();
    });
  });
}

function setLoadingMessage(message: string, percent?: number): void {
  if (!loadingWin || loadingWin.isDestroyed()) return;
  loadingWin.webContents.send('update-loading', { message, percent });
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
      if (resolved) return;
      resolved = true;
      autoUpdater.removeAllListeners();
      resolve(value);
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
      app.removeAllListeners('window-all-closed');
      setTimeout(() => {
        autoUpdater.removeAllListeners();
        autoUpdater.quitAndInstall(false, true);
      }, 1500);
    });

    autoUpdater.on('error', (err) => {
      console.error('AutoUpdater error:', err);
      if (!updateFound) done(false);
    });

    setTimeout(() => {
      if (!updateFound) {
        console.warn('Update check timed out, proceeding normally.');
        done(false);
      }
    }, 15000);

    // checkForUpdates() ritorna una Promise — va gestita
    autoUpdater
      .checkForUpdates()
      .then((result) =>
        console.log('checkForUpdates result:', result?.updateInfo?.version ?? 'none'),
      )
      .catch((err) => {
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
      resolve();
    });

    setTimeout(resolve, 30000);
  });
}

// ─── Main window ─────────────────────────────────────────────────────────────

function createMainWindow(): void {
  mainWin = new BrowserWindow({
    width: 1280,
    height: 800,
    show: false,
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

app
  .whenReady()
  .then(async () => {
    initLogger();
    console.log('App starting, version:', app.getVersion());

    try {
      await createLoadingWindow();

      if (app.isPackaged) {
        ensureDataDirectory();

        const hasUpdate = await checkForUpdate();

        if (!hasUpdate) {
          await startSpringBoot();
          createMainWindow();
        }
      } else {
        closeLoadingWindow();
        createMainWindow();
      }
    } catch (err) {
      console.error('Fatal error during startup:', err);
      dialog.showErrorBox('Errore avvio', String(err));
      app.quit();
    }
  })
  .catch((err) => {
    // whenReady() stesso non dovrebbe mai fallire, ma per sicurezza
    console.error('app.whenReady() rejected:', err);
  });

app.on('before-quit', () => {
  console.log('App quitting...');
  if (springProcess) {
    springProcess.kill();
    springProcess = null;
  }
  logStream?.end();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWin === null) createMainWindow();
});
