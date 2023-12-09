const { app, BrowserWindow, dialog} = require('electron');
const path = require('path');
const { stopFileWatcher } = require('./FileWatcher');
const { 
    initWindowEditState, 
    isEditorWindowStateEdited 
} = require('./WindowEditState');

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

    newWindow.webContents.loadFile('app/index.html');

    newWindow.once('ready-to-show', ()=>{
        newWindow.show();
    });

    newWindow.on('closed', ()=>{
        windows.delete(newWindow);
        stopFileWatcher(newWindow);
        newWindow = null;
    });

    newWindow.on('close', (event)=>{
        if(isEditorWindowStateEdited(newWindow))
        {
            event.preventDefault();

            const selectedChoice = dialog.showMessageBoxSync(newWindow, {
                type: 'warning',
                title: 'Quit with Unsaved Changes?',
                message: 'Document has unsaved changes. The changes will be lost if they are not saved.',
                buttons: ['Quit Anyway', 'Return Back to App'],
                defaultId: 1,
                cancelId: 1
            });

            if(selectedChoice === 0)
            {
                newWindow.destroy();
            }
        }
    });

    newWindow.webContents.openDevTools();

    windows.add(newWindow);

    return newWindow;
}

module.exports = {get_default_hidden_browser_window, createWindow}
