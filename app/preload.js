const {contextBridge, ipcRenderer} = require('electron');
const path = require('path');

contextBridge.exposeInMainWorld('backend', {
    setWindowTitle: (title) =>
    {    
        ipcRenderer.invoke('setWindowTitle', title)
    },
    setDocumentEdited: () => {
        ipcRenderer.invoke('setDocumentEdited');
    },
    getPathBase: (filePath) =>
    {
        return path.basename(filePath);
    },
    renderMarkdownToHtml: (markdownContent) =>{
        return ipcRenderer.invoke('renderMarkdownToHtml', markdownContent);
    },
    getFileFromUser: () => {
        ipcRenderer.invoke('getFileFromUser');
    },
    createWindow: () => {
        ipcRenderer.invoke('createWindow');
    },
    exportAsHtml: (htmlContent) => {
        ipcRenderer.invoke('exportAsHtml', htmlContent);
    },
    ExportAsMarkdown: (filePath, fileContent) => {
        ipcRenderer.invoke('ExportAsMarkdown', filePath, fileContent);
    },
    setFileOpenHandler: (handler) => {
        ipcRenderer.on('file-opened', handler);
    }
});
