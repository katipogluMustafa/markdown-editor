const fs = require('fs');
const { readFile } = require('./MarkdownDocument');

/*
 * Map of file watchers
 * 
 * Key  : Window    (Electron Window) 
 * Value: FileWatch 
 */
const fileWatchers = new Map();

const startFileWatcher = (targetWindow, file) => {
    stopFileWatcher(targetWindow);
    
    const watcher = fs.watch(file, {
        persistent: true,
    }, (event, fileName) =>
    {   
        if(event === 'change')
        {
            readFile(targetWindow, file);
        }
    });

    fileWatchers.set(targetWindow, watcher);
}

const stopFileWatcher = (targetWindow) => {
    if(fileWatchers.has(targetWindow))
    {
        fileWatchers.get(targetWindow).close();
        fileWatchers.delete(targetWindow);
    }
}

module.exports = {stopFileWatcher, startFileWatcher}