const windowEditStates = new Map();

const initWindowState = (currentWindow)=>{
    windowEditStates.set(currentWindow, false);
}

const isEditorWindowStateEdited = (currentWindow)=>
{
    return windowEditStates.get(currentWindow);
}

const markEditorWindowStateEdited = (currentWindow)=>
{
    windowEditStates.set(currentWindow, true);
}

module.exports = {initWindowState, isEditorWindowStateEdited, markEditorWindowStateEdited}