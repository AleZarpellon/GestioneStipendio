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
let win;
let springProcess;
function getResourcesPath() {
    return electron_1.app.isPackaged
        ? path.join(process.resourcesPath, 'resources')
        : path.join(__dirname, '../resources');
}
function ensureDataDirectory() {
    const dataDir = path.join(os.homedir(), 'AppData', 'Local', 'GestioneStipendio');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
}
function startSpringBoot() {
    return new Promise((resolve) => {
        var _a, _b;
        const resourcesPath = getResourcesPath();
        const javaPath = path.join(resourcesPath, 'jre', 'bin', process.platform === 'win32' ? 'java.exe' : 'java');
        const jarPath = path.join(resourcesPath, 'app.jar');
        springProcess = (0, child_process_1.spawn)(javaPath, ['-jar', jarPath]);
        (_a = springProcess.stdout) === null || _a === void 0 ? void 0 : _a.on('data', (data) => {
            const output = data.toString();
            console.log('Spring Boot OUT:', output);
            if (output.includes('Started') || output.includes('Tomcat started')) {
                resolve();
            }
        });
        (_b = springProcess.stderr) === null || _b === void 0 ? void 0 : _b.on('data', (data) => {
            const output = data.toString();
            console.log('Spring Boot ERR:', output);
            if (output.includes('Started') || output.includes('Tomcat started')) {
                resolve();
            }
        });
        setTimeout(resolve, 30000);
    });
}
function createWindow() {
    win = new electron_1.BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
        },
    });
    if (electron_1.app.isPackaged) {
        win.loadFile(path.join(process.resourcesPath, 'app.asar.unpacked', 'dist', 'browser', 'index.html'));
    }
    else {
        win.loadURL('http://localhost:4200');
    }
}
electron_updater_1.autoUpdater.on('update-available', () => {
    electron_1.dialog.showMessageBox({
        type: 'info',
        title: 'Aggiornamento disponibile',
        message: 'È disponibile una nuova versione. Verrà scaricata in background.',
    });
});
electron_updater_1.autoUpdater.on('update-downloaded', () => {
    electron_1.dialog
        .showMessageBox({
        type: 'info',
        title: 'Aggiornamento pronto',
        message: "L'aggiornamento è pronto. L'app si riavvierà ora.",
        buttons: ['Riavvia'],
    })
        .then(() => {
        electron_updater_1.autoUpdater.quitAndInstall();
    });
});
electron_1.app.whenReady().then(() => __awaiter(void 0, void 0, void 0, function* () {
    if (electron_1.app.isPackaged) {
        ensureDataDirectory();
        yield startSpringBoot();
        electron_updater_1.autoUpdater.checkForUpdatesAndNotify();
    }
    createWindow();
}));
electron_1.app.on('before-quit', () => {
    if (springProcess)
        springProcess.kill();
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
