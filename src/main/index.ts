import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { globalShortcut } from 'electron/main'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'
import { checkForUpdates, forceUpdate } from './updater'

function createWindow(): BrowserWindow {
  // Create the browser window.
  const window = new BrowserWindow({
    width: 600,
    height: 300,
    show: false,
    frame: false,
    transparent: true,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  const toggleOverLayHotkey: string = 'CommandOrControl+6'
  let isOverlayOn: boolean = false

  globalShortcut.register(toggleOverLayHotkey, () => {
    isOverlayOn = !isOverlayOn
    window.setIgnoreMouseEvents(isOverlayOn)
    console.log('main: overlay-mode', isOverlayOn)
    window.webContents.send('overlay-mode', isOverlayOn)
  })

  window.setAlwaysOnTop(true, 'normal')

  window.on('ready-to-show', () => {
    window.show()
  })

  window.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    window.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    window.loadFile(join(__dirname, '../renderer/index.html'))
  }

  if (is.dev) {
    window.webContents.openDevTools()
  }

  return window
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  ipcMain.on('minimize', () => {
    console.log('minimize')
    const win = BrowserWindow.getFocusedWindow()
    win?.minimize()
  })

  ipcMain.on('maximize', () => {
    console.log('maximize')
    const win = BrowserWindow.getFocusedWindow()
    if (win?.isMaximized()) {
      win.unmaximize()
    } else {
      win?.maximize()
    }
  })

  ipcMain.on('close', () => {
    console.log('close')
    const win = BrowserWindow.getFocusedWindow()
    win?.close()
  })

  ipcMain.on('check-update', () => {
    checkForUpdates()
  })

  ipcMain.on('force-update', () => {
    forceUpdate()
  })

  ipcMain.on('app-version', (event) => {
    console.log('app-version')
    event.returnValue = app.getVersion()
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
  console.log('is.dev', is.dev)
  if (!is.dev) {
    checkForUpdates()
  }
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
