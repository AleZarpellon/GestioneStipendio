"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const child_process_1 = require("child_process");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const electron_updater_1 = require("electron-updater");
// ─── Globals ─────────────────────────────────────────────────────────────────
let mainWin = null;
let loadingWin = null;
let springProcess = null;
// ─── Paths ───────────────────────────────────────────────────────────────────
function getResourcesPath() {
    return electron_1.app.isPackaged
        ? path.join(process.resourcesPath, 'resources')
        : path.join(__dirname, '../resources');
}
// ─── Data directory ──────────────────────────────────────────────────────────
function ensureDataDirectory() {
    const dataDir = path.join(os.homedir(), 'AppData', 'Local', 'GestioneStipendio');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
}
// ─── Loading window ──────────────────────────────────────────────────────────
function createLoadingWindow() {
    loadingWin = new electron_1.BrowserWindow({
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
function setLoadingMessage(message, percent) {
    if (!loadingWin)
        return;
    const safeMsg = message.replace(/'/g, "\\'");
    loadingWin.webContents
        .executeJavaScript(`
    document.getElementById('msg').innerText = '${safeMsg}';
    ${percent !== undefined ? `document.getElementById('bar').style.width = '${percent}%';` : ''}
  `)
        .catch(() => { });
}
function closeLoadingWindow() {
    if (loadingWin && !loadingWin.isDestroyed()) {
        loadingWin.close();
        loadingWin = null;
    }
}
// ─── Auto updater ─────────────────────────────────────────────────────────────
function checkForUpdate() {
    return new Promise((resolve) => {
        let updateFound = false;
        let resolved = false;
        const done = (value) => {
            if (!resolved) {
                resolved = true;
                resolve(value);
            }
        };
        electron_updater_1.autoUpdater.on('checking-for-update', () => {
            console.log('Checking for update...');
            setLoadingMessage('Controllo aggiornamenti...');
        });
        electron_updater_1.autoUpdater.on('update-not-available', () => {
            console.log('No update available.');
            done(false);
        });
        electron_updater_1.autoUpdater.on('update-available', (info) => {
            console.log('Update available:', info.version);
            updateFound = true;
            setLoadingMessage(`Aggiornamento ${info.version} trovato. Download in corso...`, 0);
        });
        electron_updater_1.autoUpdater.on('download-progress', (progress) => {
            const pct = Math.round(progress.percent);
            setLoadingMessage(`Download: ${pct}%`, pct);
        });
        electron_updater_1.autoUpdater.on('update-downloaded', (info) => {
            console.log('Update downloaded:', info.version);
            setLoadingMessage('Aggiornamento pronto. Riavvio...', 100);
            setTimeout(() => {
                electron_updater_1.autoUpdater.quitAndInstall(true, true);
            }, 1500);
            // Non chiamiamo done(true) — l'app si riavvierà da sola
        });
        electron_updater_1.autoUpdater.on('error', (err) => {
            console.error('AutoUpdater error:', err);
            if (!updateFound)
                done(false); // procedi normalmente se non aveva ancora trovato nulla
        });
        // Timeout di sicurezza: se il check non risponde entro 15s, procedi
        setTimeout(() => {
            if (!updateFound) {
                console.warn('Update check timed out, proceeding normally.');
                done(false);
            }
        }, 15000);
        electron_updater_1.autoUpdater.checkForUpdates().catch((err) => {
            console.error('checkForUpdates() error:', err);
            done(false);
        });
    });
}
// ─── Spring Boot ─────────────────────────────────────────────────────────────
function startSpringBoot() {
    return new Promise((resolve) => {
        var _a, _b;
        const resourcesPath = getResourcesPath();
        const javaPath = path.join(resourcesPath, 'jre', 'bin', process.platform === 'win32' ? 'java.exe' : 'java');
        const jarPath = path.join(resourcesPath, 'app.jar');
        setLoadingMessage('Avvio backend...');
        console.log('Starting Spring Boot:', jarPath);
        springProcess = (0, child_process_1.spawn)(javaPath, ['-jar', jarPath]);
        const onData = (data) => {
            const output = data.toString();
            console.log('Spring Boot:', output.trim());
            if (output.includes('Started') || output.includes('Tomcat started')) {
                resolve();
            }
        };
        (_a = springProcess.stdout) === null || _a === void 0 ? void 0 : _a.on('data', onData);
        (_b = springProcess.stderr) === null || _b === void 0 ? void 0 : _b.on('data', onData);
        springProcess.on('error', (err) => {
            console.error('Spring Boot process error:', err);
            electron_1.dialog.showErrorBox('Errore avvio backend', err.message);
            resolve(); // procedi comunque, l'app mostrerà un errore di connessione
        });
        // Timeout massimo di attesa
        setTimeout(resolve, 30000);
    });
}
// ─── Main window ─────────────────────────────────────────────────────────────
function createMainWindow() {
    mainWin = new electron_1.BrowserWindow({
        width: 1280,
        height: 800,
        show: false, // mostrata solo dopo il caricamento
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
        },
    });
    if (electron_1.app.isPackaged) {
        mainWin.loadFile(path.join(process.resourcesPath, 'app.asar.unpacked', 'dist', 'browser', 'index.html'));
    }
    else {
        mainWin.loadURL('http://localhost:4200');
    }
    mainWin.once('ready-to-show', () => {
        closeLoadingWindow();
        mainWin === null || mainWin === void 0 ? void 0 : mainWin.show();
    });
    mainWin.on('closed', () => {
        mainWin = null;
    });
}
// ─── App lifecycle ───────────────────────────────────────────────────────────
electron_1.app.whenReady().then(() => __awaiter(void 0, void 0, void 0, function* () {
    createLoadingWindow();
    if (electron_1.app.isPackaged) {
        ensureDataDirectory();
        const hasUpdate = yield checkForUpdate();
        if (!hasUpdate) {
            yield startSpringBoot();
            createMainWindow();
        }
        // se hasUpdate === true, autoUpdater.quitAndInstall() gestirà il riavvio
    }
    else {
        // Sviluppo: salta update e Spring Boot
        closeLoadingWindow();
        createMainWindow();
    }
}));
electron_1.app.on('before-quit', () => {
    if (springProcess) {
        springProcess.kill();
        springProcess = null;
    }
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
electron_1.app.on('activate', () => {
    if (mainWin === null)
        createMainWindow();
});
