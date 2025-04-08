import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      close: () => void
      minimize: () => void
      maximize: () => void
      checkUpdate: () => void
      forceUpdate: () => void
      overlayMode: (callback: (isOverlay: OverlayModeCallback) => void) => void
      removeAllListeners: (event: string) => void
      appVersion: () => string
    }
  }
}
