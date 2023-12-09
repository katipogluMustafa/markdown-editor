const { app, BrowserWindow} = require('electron');
const path = require('path');

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
    
    load_index_page(newWindow);
    show_the_window_when_dom_is_ready(newWindow);

    newWindow.on('closed', ()=>{
        windows.delete(newWindow);
        newWindow = null;
    });

    windows.add(newWindow);

    return newWindow;
}

function load_index_page(window)
{
    window.webContents.loadFile('app/index.html');
}

function show_the_window_when_dom_is_ready(window)
{
    window.once('ready-to-show', ()=>{
        window.show();
    });
}

module.exports = {get_default_hidden_browser_window, createWindow}
