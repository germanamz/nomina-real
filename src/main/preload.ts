import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  // Expose any Electron APIs needed by the renderer
});
