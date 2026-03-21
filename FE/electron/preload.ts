import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('api', {
  // Qui puoi esporre funzioni dal backend Electron ad Angular
});
