import { app, shell, BrowserWindow } from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import express from 'express'
import debug from 'electron-debug'
import { createFileRoute, createURLRoute } from 'electron-router-dom'
// import { createTray } from './trayRemotePlay'
// Ativa o modo de depuração
debug()
import fs from 'fs'
import './ipcMain'
import './staticServer'
import appStatic from './staticServer'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // createTray()

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  const devServerURL = createURLRoute(process.env['ELECTRON_RENDERER_URL']!, 'main')
  const fileRoute = createFileRoute(join(__dirname, '../renderer/index.html'), 'main')

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(devServerURL)
  } else {
    mainWindow.loadFile(...fileRoute)
  }
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

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

const initializeAppDirectory = (): string => {
  const appRoadmingPath = app.getPath('userData')
  const appBanners = path.join(appRoadmingPath, 'banners')
  if (!fs.existsSync(appBanners)) {
    fs.mkdirSync(appBanners)
  }

  const appVideosPath = app.getPath('videos')
  const appName = app.getName()
  const appDirectory = path.join(appVideosPath, appName)

  if (!fs.existsSync(appDirectory)) {
    fs.mkdirSync(appDirectory)
  }

  return appDirectory
}

const videosPath = initializeAppDirectory()

interface CategoriePath {
  movies: string
  series: string
  animes: string
}

const createCategories = (): CategoriePath => {
  const paths = [
    path.join(videosPath, 'movies'),
    path.join(videosPath, 'series'),
    path.join(videosPath, 'animes')
  ]
  paths.forEach((path) => {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path)
    }
  })
  return {
    movies: path.join(videosPath, 'movies'),
    series: path.join(videosPath, 'series'),
    animes: path.join(videosPath, 'animes')
  }
}
export const pathCategories = createCategories()

export const appRoadmingPath = app.getPath('userData')
const bannersFolderPath = path.join(appRoadmingPath, 'banners')
const dbFilePath = path.join(appRoadmingPath, 'database.sqlite')

appStatic.use('/', express.static(path.resolve(__dirname, bannersFolderPath)))
appStatic.use('/videos', express.static(path.resolve(__dirname, videosPath)))
const PORTStatic = 3333
appStatic.listen(PORTStatic, () => {
  console.log(`Servidor Express iniciado na porta ${PORTStatic}`)
})

function createSQLiteFileIfNotExists(): void {
  if (!fs.existsSync(dbFilePath)) {
    fs.writeFileSync(dbFilePath, '')
  }
}
createSQLiteFileIfNotExists()
