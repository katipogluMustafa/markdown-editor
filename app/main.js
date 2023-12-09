const { app, BrowserWindow, dialog, ipcMain} = require('electron');
const {
    get_default_hidden_browser_window,
    createWindow,  
} = require('./EditorWindow');

const {
    getFileFromUser,
} = require('./UserDialog');
const {parseMarkdownToHtml} = require('./markdown_parser');

const {
    exportAsMarkdown, 
    exportAsHtml, 
    openFile
} = require('./MarkdownDocument');

let mainWindow = null;

app.on('ready', ()=>{
    mainWindow = createWindow();

    mainWindow.on('closed', ()=>{
        mainWindow = null;
    });
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

ipcMain.handle('renderMarkdownToHtml', (event, markdown)=>
{
    return parseMarkdownToHtml(markdown);
});

ipcMain.handle('getFileFromUser', (event)=>{
    const callingWindow = BrowserWindow.fromWebContents(event.sender);

    return getFileFromUser(callingWindow);
});

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

ipcMain.handle('exportAsHtml', (event, htmlContent)=>{
    const callingWindow = BrowserWindow.fromWebContents(event.sender);

    exportAsHtml(callingWindow, htmlContent);
});

ipcMain.handle('ExportAsMarkdown', (event, filePath, content)=>{
    const callingWindow = BrowserWindow.fromWebContents(event.sender);
    
    exportAsMarkdown(callingWindow, filePath, content);
})