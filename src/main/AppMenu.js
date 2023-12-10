const { app, BrowserWindow, Menu, shell } = require('electron');

const template = [
    {
        'label': 'File',
        submenu: [
            {
                label: 'New File',
                accelerator: 'CommandOrControl+N',
                click(item, focusedWindow){ focusedWindow.webContents.send('create-window'); }
            },
            {
                label: 'Open File',
                accelerator: 'CommandOrControl+O',
                click(item, focusedWindow) { focusedWindow.webContents.send('open-file'); }
            },
            {
                label: 'Save File',
                accelerator: 'CommandOrControl+S',
                click(item, focusedWindow) {focusedWindow.webContents.send('save-file'); }
            },
            {
                label: 'Export HTML',
                accelerator: 'CommandOrControl+Shift+S',
                click(item, focusedWindow) { focusedWindow.webContents.send('save-html'); }
            },
            {
                type: 'separator',
            },
            {
                label: 'Show File',
                accelerator: 'CommandOrControl+Shift+S',
                click(item, focusedWindow){
                    if(!focusedWindow)
                    {
                        return dialog.showErrorBox('Cannot Show File\'s Location', 'There is currently no active document to show.');
                    }

                    focusedWindow.webContents.send('show-file');
                }
            },
            {
                label: 'Open in Default Editor',
                accelerator: 'CommandOrControl+Shift+O',
                click(item, focusedWindow){
                    if(!focusedWindow)
                    {
                        return dialog.showErrorBox('Cannot Open File in Default Editor', 'There is currently no active document to open.');
                    }

                    focusedWindow.webContents.send('open-in-default');
                }
            }
        ],
    },
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
        role: 'window',  // This enables the display of a list of currently open windows
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
    {
        label: 'Help',
        role: 'help',
        submenu: [
            {
                label: 'Visit Website',
                click() {/* TODO: Implement here*/}
            },
            {
                label: 'Toggle Developer Tools',
                click(item, focusedWindow) {
                    if(focusedWindow)
                    {
                        focusedWindow.webContents.toggleDevTools();
                    }
                }
            }
        ],
    }
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

    const windowMenu = template.find(item => item.label === 'Window');
    windowMenu.role = 'window';
    windowMenu.submenu.push(
        { type: 'separator' },
        {
            label: 'Bring All to Front', // Moves all of the windows of the application to the front of the stack
            role: 'front',
        }
    );
}

const applicationMenu = Menu.buildFromTemplate(template);

module.exports = {applicationMenu}