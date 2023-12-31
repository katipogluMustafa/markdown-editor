const { app, BrowserWindow, dialog, Menu} = require('electron');
const path = require('path');
const { stopFileWatcher } = require('./FileWatcher');
const { 
    initWindowEditState, 
    isEditorWindowStateEdited 
} = require('./WindowEditState');
const { shouldExitFromApp } = require('./UserDialog');
const { initWindowFileOpenState } = require('./WindowFileOpenState');
const { createApplicationMenu } = require('./AppMenu');

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
    
    initWindowEditState(newWindow);
    initWindowFileOpenState(newWindow);

    newWindow.webContents.loadFile('app/index.html');

    newWindow.once('ready-to-show', ()=>{
        createApplicationMenu();
        newWindow.show();
    });

    newWindow.on('focus', ()=> {
        createApplicationMenu();
    });

    newWindow.on('closed', ()=>{
        windows.delete(newWindow);
        stopFileWatcher(newWindow);
        createApplicationMenu();
        newWindow = null;
    });

    newWindow.on('close', (event)=>{
        if(isEditorWindowStateEdited(newWindow))
        {
            event.preventDefault();

            if(shouldExitFromApp(newWindow))
            {
                newWindow.destroy();
            }
        }
    });

    windows.add(newWindow);

    return newWindow;
}

module.exports = {get_default_hidden_browser_window, createWindow}
