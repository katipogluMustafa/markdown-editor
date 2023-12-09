const { BrowserWindow, ipcMain} = require('electron');
const { createWindow }          = require('./EditorWindow');
const { getFileFromUser }       = require('./UserDialog');
const { parseMarkdownToHtml }   = require('./MarkdownParser');
const { startFileWatcher }      = require('./FileWatcher');
const {
    exportAsMarkdown, 
    exportAsHtml,
    loadEditorWindow,
} = require('./MarkdownDocument');
const { markEditorWindowStateEdited } = require('./WindowEditState');

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
}

module.exports = {
    registerMainProcessServices,
}