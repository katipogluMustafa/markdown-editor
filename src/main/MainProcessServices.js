const { BrowserWindow, ipcMain, shell} = require('electron');
const { createWindow }          = require('./EditorWindow');
const { getFileFromUser, shouldDiscardDataUponNewFileOpen, shouldDiscardDataUponFileOverwrite }       = require('./UserDialog');
const { parseMarkdownToHtml }   = require('./MarkdownParser');
const { startFileWatcher }      = require('./FileWatcher');
const {
    exportAsMarkdown, 
    exportAsHtml,
    loadEditorWindow,
} = require('./MarkdownDocument');
const { markEditorWindowStateEdited } = require('./WindowEditState');
const { fileClosedMarkdownContextMenu, fileOpenMarkdownContextMenu } = require('./ContextMenu');
const { isWindowFileOpen } = require('./WindowFileOpenState');

function registerMainProcessServices()
{
    ipcMain.handle('renderMarkdownToHtml', (event, markdown)=>
    {
        return parseMarkdownToHtml(markdown);
    });
    
    ipcMain.handle('getFileFromUser', (event)=>{
        const callingWindow = BrowserWindow.fromWebContents(event.sender);
    
        return getFileFromUser(callingWindow);
    });
    
    ipcMain.handle('createWindow', ()=>{
        createWindow();
    });

    ipcMain.handle('openInNewWindow', ()=>{
        let newWindow = createWindow();
        newWindow.on('show', ()=>{
            newWindow.webContents.send('open-file'); 
        });
    });
    
    ipcMain.handle('setWindowTitle', (event, title)=>{
        const callingWindow = BrowserWindow.fromWebContents(event.sender);
    
        callingWindow.setTitle(title);
    });
    
    ipcMain.handle('setDocumentEdited', (event)=>
    {
        const callingWindow = BrowserWindow.fromWebContents(event.sender);
        markEditorWindowStateEdited(callingWindow);
    });
    
    ipcMain.handle('exportAsHtml', (event, htmlContent)=>{
        const callingWindow = BrowserWindow.fromWebContents(event.sender);
    
        exportAsHtml(callingWindow, htmlContent);
    });
    
    ipcMain.handle('ExportAsMarkdown', (event, filePath, content)=>{
        const callingWindow = BrowserWindow.fromWebContents(event.sender);
        
        exportAsMarkdown(callingWindow, filePath, content);
    })

    ipcMain.handle('loadFile', (event, filePath)=>{
        const callingWindow = BrowserWindow.fromWebContents(event.sender);

        loadEditorWindow(callingWindow, filePath);
    });

    ipcMain.handle('watchFile', (event, filePath) =>{
        const callingWindow = BrowserWindow.fromWebContents(event.sender);

        startFileWatcher(callingWindow, filePath);
    });

    ipcMain.handle('askDiscardUponFileOpen', (event) =>{
        const callingWindow = BrowserWindow.fromWebContents(event.sender);

        return shouldDiscardDataUponNewFileOpen(callingWindow);
    });

    ipcMain.handle('askDiscardUponOverwrite', (event) =>{
        const callingWindow = BrowserWindow.fromWebContents(event.sender);

        return shouldDiscardDataUponFileOverwrite(callingWindow);
    });

    ipcMain.handle('showFileInExplorer', (event, filePath) => {
        shell.showItemInFolder(filePath);
    });

    ipcMain.handle('openInDefaultApplication', (event, filePath) => {
        shell.openPath(filePath);
    });

    ipcMain.handle('revealEditorContextMenu', (event) => {
        const callingWindow = BrowserWindow.fromWebContents(event.sender);

        if(isWindowFileOpen(callingWindow))
        {
            fileOpenMarkdownContextMenu().popup();
        }
        else
        {
            fileClosedMarkdownContextMenu().popup();
        }
    });
}

module.exports = {
    registerMainProcessServices,
}