import { is } from '@electron-toolkit/utils'
import { BrowserWindow, dialog } from 'electron'
import log from 'electron-log'
import { autoUpdater } from 'electron-updater'
import * as path from 'path'

// Configure logger
autoUpdater.logger = log
log.transports.file.level = 'info'

// Progress window reference
let progressWindow: BrowserWindow | null = null

// Create progress window
function createProgressWindow(): void {
  progressWindow = new BrowserWindow({
    width: 400,
    height: 180,
    frame: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  // Use the correct path for both development and production
  const progressPath = is.dev
    ? path.join(__dirname, '../renderer/progress.html')
    : path.join(__dirname, '../renderer/renderer/progress.html')

  progressWindow.loadFile(progressPath)
  progressWindow.setAlwaysOnTop(true)
  if (is.dev) {
    progressWindow.webContents.openDevTools()
  }
}

// Enable updates in development mode
if (process.env.NODE_ENV === 'development') {
  autoUpdater.forceDevUpdateConfig = true
}

autoUpdater.autoDownload = false

autoUpdater.on('checking-for-update', () => {
  log.info('Checking for update...')
})

autoUpdater.on('update-available', (info) => {
  log.info('Update available:', info)
  dialog
    .showMessageBox({
      title: 'Update Available',
      message: 'A new version is available. Would you like to update now?',
      buttons: ['Update', 'Later']
    })
    .then((result) => {
      if (result.response === 0) {
        autoUpdater.downloadUpdate()
      }
    })
    .catch((err) => {
      log.error('Error showing update dialog:', err)
    })
})

autoUpdater.on('update-not-available', (info) => {
  log.info('Update not available:', info)
})

autoUpdater.on('update-downloaded', (info) => {
  log.info('Update downloaded:', info)
  progressWindow?.close()
  progressWindow = null
  dialog
    .showMessageBox({
      title: 'Update Downloaded',
      message: 'The update has been downloaded. Would you like to install it now?',
      buttons: ['Install', 'Later']
    })
    .then((result) => {
      if (result.response === 0) {
        log.info('User chose to install update, preparing to restart...')
        // Close all windows before installing
        const windows = BrowserWindow.getAllWindows()
        log.info(`Closing ${windows.length} windows before update`)
        windows.forEach((window) => window.close())

        // Give time for windows to close
        setTimeout(() => {
          log.info('Calling quitAndInstall with restart=true')
          autoUpdater.quitAndInstall(true, true)
        }, 1000)
      } else {
        log.info('User chose to install later')
      }
    })
    .catch((err) => {
      log.error('Error showing install dialog:', err)
    })
})

autoUpdater.on('download-progress', (progress) => {
  log.info(`Download progress: ${progress.percent}%`)
  if (progressWindow) {
    progressWindow?.webContents.send('update-progress', Math.round(progress.percent))
  } else {
    createProgressWindow()
  }
})

autoUpdater.on('error', (error) => {
  log.error('Update error:', error)
  dialog.showMessageBox({
    title: 'Update Error',
    message: `An error occurred while checking for updates: ${error.message}`
  })
})

/**
 * Checks for updates normally
 */
export function checkForUpdates(): void {
  autoUpdater.checkForUpdates().catch((err) => {
    log.error('Error checking for updates:', err)
  })
}

/**
 * Forces an update check by setting forceDevUpdateConfig to true
 * This will bypass version checks and force the update process
 */
export function forceUpdate(): void {
  // Store original config
  const originalConfig = autoUpdater.forceDevUpdateConfig

  // Force update config
  autoUpdater.forceDevUpdateConfig = true

  autoUpdater
    .checkForUpdates()
    .finally(() => {
      // Restore original config
      autoUpdater.forceDevUpdateConfig = originalConfig
    })
    .catch((err) => {
      log.error('Error during force update:', err)
    })
}

export { createProgressWindow }
