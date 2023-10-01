let filePath          = null;
let fileCachedContent = null;

/* Resizeable Markdown & HTML Columns */

const divider      = document.querySelector('.divider');
const rawMarkdown  = document.querySelector('.raw-markdown');
const renderedHtml = document.querySelector('.rendered-html'); 

let isDragging     = false;

divider.addEventListener('mousedown', (event) =>{
    isDragging = true;
    const startX = event.clientX;
    const initialWidth = rawMarkdown.offsetWidth;

    function onMouseMove(event)
    {
        if(isDragging)
        {
            const offsetX  = event.clientX - startX;
            const newWidth = initialWidth + offsetX;

            rawMarkdown.style.width  = newWidth + 'px';
            renderedHtml.style.width = `calc(100% - ${newWidth}px)`;
        }
    }

    function onMouseUp(event)
    {
        isDragging = false;

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
});

/* Feature: Window Title */

const path = require('path');

function updateUserInterface()
{
    let title = 'Ktpql';
    
    if(filePath)
    {
        title = `${path.basename(filePath)} - ${title}`;
        
        ipcRenderer.invoke('setWindowTitle', title);
    }
}

/* Markdown Rendering */
const {ipcRenderer} = require('electron');

const markdownView = document.querySelector('#markdown');
const htmlView     = document.querySelector('#html');

markdownView.addEventListener('keyup', (event)=>{
    const markdownContent = event.target.value;
    
    ipcRenderer.invoke('renderMarkdownToHtml', markdownContent).then(result=>
    {
        htmlView.innerHTML = result;
    });
});

const openFileButton = document.querySelector('#open-file');

openFileButton.addEventListener('click', ()=>{
    ipcRenderer.invoke('getFileFromUser');
});

ipcRenderer.on('file-opened', (event, file, content) =>{
    filePath          = file;
    fileCachedContent = content;

    markdownView.value = content;
    ipcRenderer.invoke('renderMarkdownToHtml', content).then(result=>{
        htmlView.innerHTML = result;
    });

    updateUserInterface();
});

/* Feature: New File */

const newFileButton       = document.querySelector('#new-file');

newFileButton.addEventListener('click', ()=>{
    ipcRenderer.invoke('createWindow');
});

/* Button Event Handling */

const saveMarkdownButton  = document.querySelector('#save-markdown');
const revertButton        = document.querySelector('#revert');
const saveHtmlButton      = document.querySelector('#save-html');
const showFileButton      = document.querySelector('#show-file');
const openInDefaultButton = document.querySelector('#open-in-default');