const { app, dialog} = require('electron');
const fs = require('fs');
const path = require('path');
const { markWindowFileOpen } = require('./WindowFileOpenState');

function loadEditorWindow(callingWindow, file)
{
    try
    {
        const fileContent = fs.readFileSync(file).toString();

        app.addRecentDocument(file);
        markWindowFileOpen(callingWindow);

        callingWindow.webContents.send('file-opened', file, fileContent);

        updateWindowTitleWithFileName(callingWindow, file);
    }
    catch(error)
    {
        console.log(`File Read Error: ${error.message}`);
    }
}

function updateWindowTitleWithFileName(callingWindow, filePath)
{
    let title = 'Ktpql';
    
    if(filePath)
    {
        title = `${path.basename(filePath)} - ${title}`;
    }

    callingWindow.setTitle(title);
}

function exportAsHtml(callingWindow, content)
{
    const file = dialog.showSaveDialogSync(callingWindow, {
        title: 'Export As HTML',
        defaultPath: app.getPath('documents'),
        filters: [
            {name: 'HTML Files', extensions: ['html', 'htm']}
        ],
        buttonLabel: 'Save HTML',
    });

    if(!file)
    {
        return;
    }

    fs.writeFileSync(file, content);
}

function exportAsMarkdown(callingWindow, filePath, content)
{
    let file = null;

    if(null == filePath)
    {
        file = dialog.showSaveDialogSync(callingWindow, {
            title: 'Save As Markdown',
            defaultPath: app.getPath('documents'),
            filters: [
                {name: 'Markdown Files', extensions: ['md', 'markdown']}
            ]
        });

        if(!file)
        {
            return;
        }

        fs.writeFileSync(file, content);
        loadEditorWindow(callingWindow, file);
    }
    else
    {
        fs.writeFileSync(filePath, content);
        loadEditorWindow(callingWindow, filePath);
    }
}

module.exports = {exportAsMarkdown, exportAsHtml, loadEditorWindow}