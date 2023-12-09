const { app, BrowserWindow, ipcMain} = require('electron');
const { createWindow }        = require('./main/EditorWindow');
const { getFileFromUser }     = require('./main/UserDialog');
const { parseMarkdownToHtml } = require('./main/MarkdownParser');

const {
    exportAsMarkdown, 
    exportAsHtml, 
    openFile
} = require('./main/MarkdownDocument');

app.on('ready', ()=>{
    createWindow();
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