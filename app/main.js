const { app, BrowserWindow} = require('electron');

let mainWindow = null;

app.on('ready', ()=>{
    mainWindow = get_default_hidden_browser_window();
    load_index_page();
    show_the_window_when_dom_is_ready();
    
    mainWindow.on('closed', ()=>{
        mainWindow = null;
    });
});

function get_default_hidden_browser_window()
{
    return new BrowserWindow({
        width: 1366,
        height: 768,
        webPreferences: {
            nodeIntegration: true,
            worldSafeExecuteJavascript: false,
            contextIsolation: false,
        },
        show: false,
    });
}

function load_index_page()
{
    mainWindow.webContents.loadFile('app/index.html');
}

function show_the_window_when_dom_is_ready()
{
    mainWindow.once('ready-to-show', ()=>{
        mainWindow.show();
    });
}