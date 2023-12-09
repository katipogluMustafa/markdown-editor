const { app, dialog} = require('electron');
const fs = require('fs');
const { readFile } = require('./MarkdownDocument');

function getFileFromUser(callingWindow)
{
    const is_operation_canceled = false;

    const files = dialog.showOpenDialogSync(callingWindow, {
        properties: ['openFile'],
        filters: [
            { name: 'Markdown Files', extensions: ['md', 'markdown'] },
            { name: 'Text Files', extensions: ['txt'] }
        ]
    });

    if(!files)
    {
        return;
    }

    let file1 = files[0];
    try
    {
        readFile(callingWindow, file1);
    }
    catch(error)
    {
        console.log(`File Read Error: ${error.message}`);
    }
}

module.exports = {getFileFromUser}