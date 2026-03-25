"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('api', {
// Qui puoi esporre funzioni dal backend Electron ad Angular
});
// Ascolta aggiornamenti del loading
electron_1.ipcRenderer.on('update-loading', (event, { message, percent }) => {
    const msgEl = document.getElementById('msg');
    const barEl = document.getElementById('bar');
    if (msgEl)
        msgEl.innerText = message;
    if (barEl && percent !== undefined)
        barEl.style.width = `${percent}%`;
});
