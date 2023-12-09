const {contextBridge, ipcRenderer} = require('electron');
const path = require('path');

contextBridge.exposeInMainWorld('path', {
    getBase: (filePath) =>
    {
        return path.basename(filePath);
    },
});

contextBridge.exposeInMainWorld('appWindow', {
    create: () => {
        ipcRenderer.invoke('createWindow');
    },
    setTitle: (title) =>
    {    
        ipcRenderer.invoke('setWindowTitle', title)
    },
    setEdited: () => {
        ipcRenderer.invoke('setDocumentEdited');
    },
});

contextBridge.exposeInMainWorld('backend', {
    renderMarkdownToHtml: (markdownContent) =>{
        return ipcRenderer.invoke('renderMarkdownToHtml', markdownContent);
    },
    getFileFromUser: () => {
        ipcRenderer.invoke('getFileFromUser');
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
