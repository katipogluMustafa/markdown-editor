const { app, BrowserWindow, dialog} = require('electron');
const fs = require('fs');

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
        const fileContent = fs.readFileSync(file1).toString();

        //console.log(file1);
        //console.log(fileContent);

        callingWindow.webContents.send('file-opened', file1, fileContent);
        app.addRecentDocument(file1);
    }
    catch(error)
    {
        console.log(`File Read Error: ${error.message}`);
    }
}

module.exports = {getFileFromUser}