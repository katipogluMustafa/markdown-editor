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

contextBridge.exposeInMainWorld('htmlDocument', {
    /*
     * Export the rendered-markdown document.
     */
    export: (htmlContent) => {
        ipcRenderer.invoke('exportAsHtml', htmlContent);
    },
});

contextBridge.exposeInMainWorld('markdownDocument', {
    export: (filePath, fileContent) => {
        ipcRenderer.invoke('ExportAsMarkdown', filePath, fileContent);
    },
    /*
     * Render markdown document to HTML.
     */
    render: (markdownContent) =>{
        return ipcRenderer.invoke('renderMarkdownToHtml', markdownContent);
    },
    load: (filePath) => {
        ipcRenderer.invoke('loadFile', filePath);
    },
    /*
     * Watch markdown document for changes.
     */
    watch: (filePath) => {
        ipcRenderer.invoke('watchFile', filePath);
    }
});

contextBridge.exposeInMainWorld('userDialog', {
    getFile: () => {
        ipcRenderer.invoke('getFileFromUser');
    },
});

contextBridge.exposeInMainWorld('eventHandler', {
    setFileOpenHandler: (handler) => {
        ipcRenderer.on('file-opened', handler);
    }
});
