const { app, BrowserWindow} = require('electron');
const path = require('path');
const {stopFileWatcher} = require('./FileWatcher');

function get_default_hidden_browser_window()
{
    let x,y;

    const currentWindow = BrowserWindow.getFocusedWindow();

    if(currentWindow)
    {
        const [currentWindowX, currentWindowY] = currentWindow.getPosition();

        x = currentWindowX + 10;
        y = currentWindowY + 10;
    }

    return new BrowserWindow({
        width: 1366,
        height: 768,
        x:x,
        y:y,
        webPreferences: {
            nodeIntegration: false,
            sandbox: false,
            worldSafeExecuteJavascript: false,
            contextIsolation: true,
            preload: path.join(__dirname, '../renderer/preload.js')
        },
        show: false,
    });
}

/* Feature: Multiple Windows with New File */

const windows = new Set();

function createWindow()
{
    let newWindow = get_default_hidden_browser_window();
    
    newWindow.webContents.loadFile('app/index.html');

    newWindow.once('ready-to-show', ()=>{
        newWindow.show();
    });

    newWindow.on('closed', ()=>{
        windows.delete(newWindow);
        stopFileWatcher(newWindow);
        newWindow = null;
    });

    newWindow.webContents.openDevTools();

    windows.add(newWindow);

    return newWindow;
}

module.exports = {get_default_hidden_browser_window, createWindow}
