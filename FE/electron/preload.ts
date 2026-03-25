import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  // Qui puoi esporre funzioni dal backend Electron ad Angular
});

// Ascolta aggiornamenti del loading
ipcRenderer.on('update-loading', (event, { message, percent }) => {
  const msgEl = document.getElementById('msg');
  const barEl = document.getElementById('bar');
  if (msgEl) msgEl.innerText = message;
  if (barEl && percent !== undefined) barEl.style.width = `${percent}%`;
});
