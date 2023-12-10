const { Menu, BrowserWindow } = require('electron');

const fileClosedMarkdownContextMenu = () => createMarkdownContextMenu(false);
const fileOpenMarkdownContextMenu   = () => createMarkdownContextMenu(true);

const createMarkdownContextMenu = (fileOpen) =>
{
    return Menu.buildFromTemplate([
        {
            label: 'Open File', 
            click(item, focusedWindow){ focusedWindow.webContents.send('open-file'); }
        },
        {
            label: 'Show File in Folder', 
            click(item, focusedWindow) { focusedWindow.webContents.send('show-file'); },
            enabled: fileOpen,
        },
        {
            label: 'Open in Default Editor', 
            click(item, focusedWindow) { focusedWindow.webContents.send('open-in-default'); },
            enabled: fileOpen,
        },
        {type: 'separator'},
        {label: 'Cut', role: 'cut'},
        {label: 'Copy', role: 'copy'},
        {label: 'Paste', role: 'paste'},
        {label: 'Select All', role: 'selectall'},
    ]);
}

module.exports = {fileClosedMarkdownContextMenu, fileOpenMarkdownContextMenu}