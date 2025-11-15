const { app, BrowserWindow } = require('electron')
const path = require('path')
const fs = require('fs')

function getLogFile() {
  // Use productName folder (FretPilot) but guard if not yet ready
  let userDataDir
  try { userDataDir = app.getPath('userData') } catch { userDataDir = process.cwd() }
  return path.join(userDataDir, 'fretpilot-electron.log')
}

function logLine(line) {
  const file = getLogFile()
  const stamp = new Date().toISOString()
  fs.appendFile(file, `[${stamp}] ${line}\n`, err => { if (err) console.error('Log write failed:', err) })
  console.log(line)
}

function createWindow () {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    title: 'FretPilot',
    show: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // Open dev tools only in development
  if (!app.isPackaged) {
    win.webContents.openDevTools({ mode: 'detach' })
  }

  // Capture console messages from renderer
  win.webContents.on('console-message', (event, level, message, line, sourceId) => {
    logLine(`[renderer console] lvl=${level} message="${message}" line=${line} src=${sourceId}`)
  })

  // Capture unhandled errors when possible
  win.webContents.on('crashed', () => {
    logLine('[renderer] webContents crashed')
  })
  win.webContents.on('did-fail-load', (e, code, desc, url, isMainFrame) => {
    logLine(`[renderer] did-fail-load code=${code} desc=${desc} url=${url} mainFrame=${isMainFrame}`)
  })

  if (app.isPackaged) {
    // In the packaged asar, dist sits alongside main.js, so don't go up a directory
    const indexPath = path.join(__dirname, 'dist', 'index.html')
    logLine(`[FretPilot] Loading packaged file: ${indexPath}`)
    win.loadFile(indexPath).catch(err => {
      logLine(`[FretPilot] Failed to load packaged dist file: ${err.message}`)
    })
  } else {
    const devUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173'
    logLine(`[FretPilot] Loading dev server: ${devUrl}`)
    win.loadURL(devUrl).catch(e => logLine(`[FretPilot] Failed to load dev server: ${e.message}`))
  }
  // Write first line to ensure log file exists
  logLine('[FretPilot] createWindow finished setup')
  // Test direct file write to verify userData path
  try {
    const testFile = path.join(app.getPath('userData'), 'fretpilot-path-test.txt')
    fs.writeFileSync(testFile, 'path test '+new Date().toISOString())
  } catch(e) {
    logLine('[FretPilot] userData path write failed: '+e.message)
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
