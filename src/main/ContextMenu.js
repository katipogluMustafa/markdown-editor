const { Menu } = require('electron');

const markdownContextMenu = Menu.buildFromTemplate([
    {label: 'Open File', click(item, focusedWindow){ focusedWindow.webContents.send('open-file'); }},
    {type: 'separator'},
    {label: 'Cut', role: 'cut'},
    {label: 'Copy', role: 'copy'},
    {label: 'Paste', role: 'paste'},
    {label: 'Select All', role: 'selectall'},
]);

module.exports = {markdownContextMenu}