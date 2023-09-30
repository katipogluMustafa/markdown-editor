const { app, BrowserWindow, dialog, ipcMain} = require('electron');

let mainWindow = null;

app.on('ready', ()=>{
    mainWindow = createWindow();

    mainWindow.on('closed', ()=>{
        mainWindow = null;
    });

    /*
    * Initialize electron remote dev environment
    */
    require('@electron/remote/main').initialize()
    require("@electron/remote/main").enable(mainWindow.webContents)
});

function get_default_hidden_browser_window()
{
    return new BrowserWindow({
        width: 1366,
        height: 768,
        webPreferences: {
            nodeIntegration: true,
            sandbox: false,
            worldSafeExecuteJavascript: false,
            contextIsolation: false,
        },
        show: false,
    });
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


/* Feature: Open File*/
const fs = require('fs');

function getFileFromUser()
{
    const is_operation_canceled = false;

    const files = dialog.showOpenDialogSync({
        properties: ['openFile'],
        filters: [
            { name: 'Markdown Files', extensions: ['md', 'markdown'] },
            { name: 'Text Files', extensions: ['txt'] }
        ]
    });

    if(!files)
    {
        return;
    }

    let file1 = files[0];
    try
    {
        const fileContent = fs.readFileSync(file1).toString();

        console.log(file1);
        console.log(fileContent);

        renderMarkdownToHtml(fileContent);
    }
    catch(error)
    {
        console.log(`File Read Error: ${error.message}`);
    }
}

ipcMain.handle('getFileFromUser', ()=>{
    return getFileFromUser();
});

/* Feature: Multiple Windows */

const windows = new Set();

function createWindow()
{
    let newWindow = get_default_hidden_browser_window();
    
    load_index_page(newWindow);
    show_the_window_when_dom_is_ready(newWindow);

    newWindow.on('closed', ()=>{
        windows.delete(newWindow);
    });

    windows.add(newWindow);

    return newWindow;
}