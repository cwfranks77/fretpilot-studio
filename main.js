const { app, BrowserWindow } = require('electron')
const path = require('path')
const fs = require('fs')

function log(msg) {
  const stamp = new Date().toISOString()
  console.log('[FretPilot main]', msg)
  try {
    const file = path.join(app.getPath('userData'), 'fretpilot-main.log')
    fs.appendFileSync(file, `[${stamp}] ${msg}\n`)
  } catch {}
}

function createWindow () {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    title: 'FretPilot',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  const devUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173'
  const indexPath = path.join(__dirname, 'dist', 'index.html')

  if (app.isPackaged) {
    log('Loading packaged file: ' + indexPath)
    win.loadFile(indexPath).catch(err => {
      log('Failed to load packaged index.html: ' + err.message)
    })
  } else {
    log('Loading dev server: ' + devUrl)
    win.loadURL(devUrl).catch(err => {
      log('Dev server failed: ' + err.message + ' falling back to file')
      win.loadFile(indexPath).catch(e => log('Fallback file failed: ' + e.message))
    })
    win.webContents.openDevTools({ mode: 'detach' })
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
