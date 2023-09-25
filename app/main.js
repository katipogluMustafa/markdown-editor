const { app, BrowserWindow, dialog} = require('electron');
const fs = require('fs');

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
        getFileFromUser();
    });
}

function getFileFromUser()
{
    const is_operation_canceled = false;

    const files = dialog.showOpenDialogSync(mainWindow, {
        properties: ['openFile'],
        filters: [
            { name: 'Text Files', extensions: ['txt'] },
            { name: 'Markdown Files', extensions: ['md', 'markdown'] }
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
    }
    catch(error)
    {
        console.log(`File Read Error: ${error.message}`);
    }
}