const windowEditStates = new Map();

const initWindowEditState = (currentWindow)=>{
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

module.exports = {initWindowEditState, isEditorWindowStateEdited, markEditorWindowStateEdited}