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

/* Handle MacOS Window Closed */

app.on('window-all-closed', ()=>{
    if(process.platform === 'darwin')
    {
        return false;
    }

    app.quit();
});


app.on('activate', (event, hasVisibleWindows)=>{
    if(!hasVisibleWindows)
    {
        createWindow;
    }
});

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
            nodeIntegration: true,
            sandbox: false,
            worldSafeExecuteJavascript: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
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
/* Feature: Markdown Rendering */
const {parseMarkdownToHtml} = require('./markdown_parser');

ipcMain.handle('renderMarkdownToHtml', (event, markdown)=>
{
    return parseMarkdownToHtml(markdown);
});

/* Feature: Open File*/
const fs = require('fs');
const path = require('path');

function updateWindowTitleWithFileName(callingWindow, filePath)
{
    let title = 'Ktpql';
    
    if(filePath)
    {
        title = `${path.basename(filePath)} - ${title}`;
    }

    callingWindow.setTitle(title);
}

function openFile(callingWindow, file)
{
    try
    {
        const fileContent = fs.readFileSync(file).toString();

        app.addRecentDocument(file);

        mainWindow.webContents.send('file-opened', file, fileContent);
        updateWindowTitleWithFileName(callingWindow, file);
    }
    catch(error)
    {
        console.log(`File Read Error: ${error.message}`);
    }
}

function getFileFromUser(callingWindow)
{
    const is_operation_canceled = false;

    const files = dialog.showOpenDialogSync(callingWindow, {
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

        //console.log(file1);
        //console.log(fileContent);

        mainWindow.webContents.send('file-opened', file1, fileContent);
        app.addRecentDocument(file1);
    }
    catch(error)
    {
        console.log(`File Read Error: ${error.message}`);
    }
}

ipcMain.handle('getFileFromUser', (event)=>{
    const callingWindow = BrowserWindow.fromWebContents(event.sender);

    return getFileFromUser(callingWindow);
});

/* Feature: Multiple Windows with New File */

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

    newWindow.webContents.openDevTools();

    return newWindow;
}

ipcMain.handle('createWindow', ()=>{
    return createWindow();
});

ipcMain.handle('setWindowTitle', (event, title)=>{
    const callingWindow = BrowserWindow.fromWebContents(event.sender);

    callingWindow.setTitle(title);
});

ipcMain.handle('setDocumentEdited', (event)=>
{
    const callingWindow = BrowserWindow.fromWebContents(event.sender);

    callingWindow.setDocumentEdited(true);
});


app.on('will-finish-launching', ()=>{
    app.on('open-file', (event, file) =>{
        const window = createWindow();
        window.once('ready-to-show', ()=>{
            openFile(window, file);
        });
    });
});

/* Rendered HTML Exporting */
function exportAsHtml(callingWindow, content)
{
    const file = dialog.showSaveDialogSync(callingWindow, {
        title: 'Export As HTML',
        defaultPath: app.getPath('documents'),
        filters: [
            {name: 'HTML Files', extensions: ['html', 'htm']}
        ]
    });

    if(!file)
    {
        return;
    }

    fs.writeFileSync(file, content);
}

ipcMain.handle('exportAsHtml', (event, htmlContent)=>{
    const callingWindow = BrowserWindow.fromWebContents(event.sender);

    exportAsHtml(callingWindow, htmlContent);
});

/* File Markdown Content Exporting */
function exportAsMarkdown(callingWindow, filePath, content)
{
    let file = null;

    if(null == filePath)
    {
        file = dialog.showSaveDialogSync(callingWindow, {
            title: 'Save As Markdown',
            defaultPath: app.getPath('documents'),
            filters: [
                {name: 'Markdown Files', extensions: ['md', 'markdown']}
            ]
        });
    }

    if(!file)
    {
        return;
    }

    fs.writeFileSync(file, content);
    openFile(callingWindow, file);
}

ipcMain.handle('ExportAsMarkdown', (event, filePath, content)=>{
    const callingWindow = BrowserWindow.fromWebContents(event.sender);
    
    exportAsMarkdown(callingWindow, filePath, content);
})