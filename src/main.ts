import { exec, execFile } from 'child_process';
import { app, BrowserWindow, dialog, ipcMain, Menu, session } from 'electron';
import net from 'net';
import path from 'path';

if (require('electron-squirrel-startup')) {
  app.quit();
}

const handleStartupEvent = () => {
  if (process.platform !== 'win32') {
    return false;
  }

  const squirrelCommand = process.argv[1];
  switch (squirrelCommand) {
    case '--squirrel-install':
      const target = path.basename(process.execPath);
      const updateDotExe = path.resolve(path.dirname(process.execPath), '..', 'update.exe');
      const createShortcut = updateDotExe + '--createShortcut=' + target + '--shortcut-locations=Desktop,StartMenu';
      exec(createShortcut);
      // Always quit when done

      return true;

    case '--squirrel-updated':
      // Optionally do things such as:
      //
      // - Install desktop and start menu shortcuts
      // - Add your .exe to the PATH
      // - Write to the registry for things like file associations and
      //   explorer context menus

      // Always quit when done
      app.quit();

      return true;
    case '--squirrel-uninstall':
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers

      // Always quit when done
      app.quit();

      return true;
    case '--squirrel-obsolete':
      // This is called on the outgoing version of your app before
      // we update to the new version - it's the opposite of
      // --squirrel-updated
      app.quit();
      return true;
  }
};

if (handleStartupEvent()) {
  app.quit();
}

const Browsericon = path.join(__dirname, '/static/icons/icon.png');
declare var MAIN_WINDOW_WEBPACK_ENTRY: any;
declare var MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: any;

declare var SECOND_WINDOW_WEBPACK_ENTRY: any;
declare var SECOND_WINDOW_PRELOAD_WEBPACK_ENTRY: any;

ipcMain.on('request-mainprocess-action', (event: any, arg: any) => {
  createSecondWindow();
});

// Tor Windows
const StartTorWindows = () => {
  execFile(`${__dirname}\\static\\Tor\\Tor\\tor.exe`);
};

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: any;
let secondWindow: any;

const createWindow = () => {
  const filter = {
    urls: ['https://*.wtfismyip.com/*', 'https://*.moneypot.com/*'],
  };
  session.defaultSession.webRequest.onHeadersReceived(filter, (details: any, callback) => {
    details.responseHeaders['access-control-allow-origin'] = '*';
    callback({ responseHeaders: Object.assign({}, details.responseHeaders) });
  });
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 1600,
    webPreferences: {
      nodeIntegration: false,
      allowRunningInsecureContent: false,
      webSecurity: true,
      // Due to CORS ERRORS.
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });
  mainWindow.autoHideMenuBar = true;
  mainWindow.resizable = true;

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  mainWindow.setIcon(Browsericon);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Check for all windows.
  mainWindow.webContents.session.setProxy({
    proxyRules: 'socks5://127.0.0.1:9050',
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};

const createSecondWindow = () => {
  // Create the browser window.
  secondWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      webSecurity: true,
      allowRunningInsecureContent: false,
      preload: SECOND_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  secondWindow.loadURL(SECOND_WINDOW_WEBPACK_ENTRY);
  secondWindow.setIcon(Browsericon);
  secondWindow.autoHideMenuBar = true;
  // This is unnecessary- but - ...
  secondWindow.webContents.session.setProxy({
    proxyRules: 'socks5://127.0.0.1:9050',
  });
  // Open the DevTools.
  // secondWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  secondWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    secondWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

// check tor
const portInUse = async (port: number | undefined, callback: { (returnValue: any): void; (arg0: boolean): void }) => {
  const server = net.createServer((socket) => {
    socket.write('Echo server\r\n');
    socket.pipe(socket);
  });

  server.listen(port, '127.0.0.1');
  server.on('error', (e) => {
    callback(true);
  });
  server.on('listening', (e: any) => {
    server.close();
    callback(false);
  });
};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const checkTor = async () => {
  if (process.platform === 'win32') {
    StartTorWindows();
    await delay(5000);
  }
  portInUse(9050, (returnValue: boolean) => {
    returnValue === false && tormessage();
  });
};
app.on('ready', () => {
  checkTor(), createWindow();
});

const options = {
  type: 'question',
  buttons: ['I will check!'],
  defaultId: 1,
  title: 'is tor running?',
  message: 'Heya, are you sure tor is running?',
  detail: "it doesn't seem like anything is running on 127.0.0.1:9050! please check!",
  //  checkboxLabel: "do not show message anymore",
  //  checkboxChecked: true,
};

// Minimum options object
const tormessage = async () => {
  await dialog.showMessageBox(options);
};

// I don't want users opening tabs themselves, so this code is unnecessary.
app.on('browser-window-created', (e: any, window: any) => {
  window.setMenuBarVisibility(false), window.setIcon(Browsericon);
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
  if (process.platform === 'win32') {
    // Maybe kill tor here. Debugging to see if this is necessary.
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null && secondWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
