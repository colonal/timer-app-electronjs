import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge } from 'electron'
import { ipcRenderer } from 'electron/renderer'

type OverlayModeCallback = (isOverlay: boolean) => void

// Custom APIs for renderer
const api = {
  close: (): void => {
    ipcRenderer.send('close')
  },
  minimize: (): void => {
    ipcRenderer.send('minimize')
  },
  maximize: (): void => {
    ipcRenderer.send('maximize')
  },
  checkUpdate: (): void => {
    ipcRenderer.send('check-update')
  },
  forceUpdate: (): void => {
    ipcRenderer.send('force-update')
  },
  overlayMode: (callback: OverlayModeCallback): void => {
    ipcRenderer.on('overlay-mode', (_, isOverlay) => {
      console.log('preload: overlay-mode', isOverlay)
      callback(isOverlay)
    })
  },
  removeAllListeners: (event: string): void => {
    ipcRenderer.removeAllListeners(event)
  },
  appVersion: (): string => {
    return ipcRenderer.sendSync('app-version')
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
