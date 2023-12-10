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
    openInNewWindow: () => {
        ipcRenderer.invoke('openInNewWindow');
    }
});

contextBridge.exposeInMainWorld('osExplorer', {
    reveal: (filePath) => {
        ipcRenderer.invoke('showFileInExplorer', filePath);
    }
});

contextBridge.exposeInMainWorld('osDefaultApp', {
    openMarkdown: (filePath) => {
        ipcRenderer.invoke('openInDefaultApplication', filePath);
    }
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
        return ipcRenderer.invoke('getFileFromUser');
    },
    askShouldDiscardUponFileOpen: () => {
        return ipcRenderer.invoke('askDiscardUponFileOpen');
    },
    askShouldDiscardUponOverwrite: ()=> {
        return ipcRenderer.invoke('askDiscardUponOverwrite');
    }
});

contextBridge.exposeInMainWorld('eventHandler', {
    setFileOpenHandler: (handler) => {
        ipcRenderer.on('file-opened', handler);
    },
    setFileChangedHandler: (handler) => {
        ipcRenderer.on('file-changed', handler);
    },
    setCreateWindowHandler: (handler) => {
        ipcRenderer.on('create-window', handler);
    },
    setOpenFileHandler: (handler) => {
        ipcRenderer.on('open-file', handler);
    },
    setSaveFileHandler: (handler) => {
        ipcRenderer.on('save-file', handler);
    },
    setSaveHtmlHandler: (handler) => {
        ipcRenderer.on('save-html', handler);
    },
    setShowFileHandler: (handler) => {
        ipcRenderer.on('show-file', handler);
    },
    setOpenInDefaultAppHandler: (handler) => {
        ipcRenderer.on('open-in-default', handler);
    },
    setOpenInNewWindowHandler: (handler) => {
        ipcRenderer.on('open-in-new-window', handler);
    }
});

contextBridge.exposeInMainWorld('menu', {
    reveal: () => {
        ipcRenderer.invoke('revealEditorContextMenu');
    }
});