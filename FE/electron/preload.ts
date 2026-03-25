import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  onUpdateLoading: (
    callback: (data: { message: string; percent?: number; state?: string }) => void,
  ) => {
    ipcRenderer.on('update-loading', (_, data) => callback(data));
  },
});
