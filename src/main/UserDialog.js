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

const shouldExitFromApp = (currentWindow)=>{
    let result = false;

    const selectedChoice = dialog.showMessageBoxSync(currentWindow, {
        type: 'warning',
        title: 'Quit with Unsaved Changes?',
        message: 'Document has unsaved changes. The changes will be lost if they are not saved.',
        buttons: ['Quit Anyway', 'Return Back to App'],
        defaultId: 1,
        cancelId: 1
    });

    if(selectedChoice === 0)
    {
        result = true;
    }

    return result;
}

module.exports = {getFileFromUser, shouldExitFromApp}