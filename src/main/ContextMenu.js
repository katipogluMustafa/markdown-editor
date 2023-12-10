const { Menu } = require('electron');

const markdownContextMenu = Menu.buildFromTemplate([
    {label: 'Open File', click(item, focusedWindow){ focusedWindow.webContents.send('open-file'); }},
    {label: 'Show File in Folder', click(item, focusedWindow) { focusedWindow.webContents.send('show-file'); }},
    {label: 'Open in Default Editor', click(item, focusedWindow) { focusedWindow.webContents.send('open-in-default'); }},
    {type: 'separator'},
    {label: 'Cut', role: 'cut'},
    {label: 'Copy', role: 'copy'},
    {label: 'Paste', role: 'paste'},
    {label: 'Select All', role: 'selectall'},
]);

module.exports = {markdownContextMenu}