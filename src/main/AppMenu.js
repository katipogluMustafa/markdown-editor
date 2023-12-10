const { app, BrowserWindow, Menu, shell } = require('electron');

const template = [
    {
        label: 'Edit',
        submenu: [
            {
                label: 'Undo',
                accelerator: 'CommandOrControl+Z',
                role: 'undo',
            },
            {
                label: 'Redo', 
                accelerator: 'Shift+CommandOrControl+Z',
                role: 'redo',
            },
            { type: 'separator' },
            {
                label: 'Cut',
                accelerator: 'CommandOrControl+X',
                role: 'cut',
            },
            {
                label: 'Copy',
                accelerator: 'CommandOrControl+C',
                role: 'copy',
            },
            {
                label: 'Paste',
                accelerator: 'CommandOrControl+V',
                role: 'paste',
            },
            {
                label: 'Select All',
                accelerator: 'CommandOrControl+A',
                role: 'selectall',
            },
        ],
    },
    {
        label: 'Window',
        submenu: [
            {
                label: 'Minimize',
                accelerator: 'CommandOrControl+M',
                role: 'minimize',
            },
            {
                label: 'Close',
                accelerator: 'CommandOrControl+W',
                role: 'close',
            },
        ],
    },
];

if(process.platform === 'darwin')
{
    const appName = 'Markdown Editor';
    template.unshift(
        {
            label: appName,
            submenu: [
                {
                    label: `About ${appName}`,
                    role: 'about',
                },
                { type: 'separator' },
                {
                    label: `Hide ${appName}`,
                    accelerator: 'Command+H',
                    role: 'hide',
                },
                {
                    label: 'Hide Others', 
                    accelerator: 'Command+Alt+H',
                    role: 'hideothers',
                },
                {
                    label: 'Show All',
                    role: 'unhide',
                },
                { type: 'separator' },
                {
                    label: `Quit ${appName}`,
                    accelerator: 'Command+Q',
                    click() {app.quit();},
                }
            ],
        });
}

const applicationMenu = Menu.buildFromTemplate(template);

module.exports = {applicationMenu}