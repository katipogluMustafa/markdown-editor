const windowOpenFileStates = new Map();

const initWindowFileOpenState = (currentWindow) => {
    windowOpenFileStates.set(currentWindow, false);
}

const isWindowFileOpen = (currentWindow) => {
    return !!windowOpenFileStates.get(currentWindow);
}

const markWindowFileOpen = (currentWindow) => {
    return windowOpenFileStates.set(currentWindow, true);
}

module.exports = {initWindowFileOpenState, isWindowFileOpen, markWindowFileOpen}