const { app, Menu }          = require('electron');
const { createWindow } = require('./main/EditorWindow');
const { loadEditorWindow }     = require('./main/MarkdownDocument');
const {registerMainProcessServices} = require('./main/MainProcessServices');
const {createApplicationMenu} = require('./main/AppMenu');

app.on('ready', ()=>{
    createWindow();
});

app.on('window-all-closed', ()=>{
    if(process.platform === 'darwin')
    {
        return false;
    }

    app.quit();
});

app.on('activate', (event, hasVisibleWindows)=>{
    if(!hasVisibleWindows)
    {
        createWindow();
    }
});

app.on('will-finish-launching', ()=>{
    app.on('open-file', (event, file) =>{
        const window = createWindow();
        window.once('ready-to-show', ()=>{
            loadEditorWindow(window, file);
        });
    });
});

registerMainProcessServices();
