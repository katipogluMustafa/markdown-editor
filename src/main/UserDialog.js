const { dialog} = require('electron');

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
        return null;
    }

    let file1 = files[0];

    return file1;
}

module.exports = {getFileFromUser}