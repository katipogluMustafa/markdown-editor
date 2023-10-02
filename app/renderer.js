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
    }

    ipcRenderer.invoke('setWindowTitle', title);
}

const saveMarkdownButton  = document.querySelector('#save-markdown');
const revertButton        = document.querySelector('#revert');

function updateUserInterfaceAsEdited()
{
    ipcRenderer.invoke('setDocumentEdited');

    saveMarkdownButton.disabled = false;
    revertButton.disabled       = false;
}

function updateUserInterfaceAsNoChange()
{
    saveMarkdownButton.disabled = true;
    revertButton.disabled       = true;
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

    if(markdownContent === fileCachedContent)
    {
        updateUserInterfaceAsNoChange();
    }
    else
    {
        updateUserInterfaceAsEdited();
    }
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

/* Feature: Save File */
const saveHtmlButton      = document.querySelector('#save-html');
saveHtmlButton.addEventListener('click', ()=>{
    let htmlContent = htmlView.innerHTML;

    ipcRenderer.invoke('exportAsHtml', htmlContent);
});


/* Feature: Save as Markdown File */
saveMarkdownButton.addEventListener('click', ()=>{
    let fileContent = markdownView.value;

    ipcRenderer.invoke('ExportAsMarkdown', filePath, fileContent);
});

/* Feature: Revert File Contents */
revertButton.addEventListener('click', ()=>{
    markdownView.value = fileCachedContent;

    ipcRenderer.invoke('renderMarkdownToHtml', fileCachedContent).then(result=>{
        htmlView.innerHTML = result;
    });
});


/* Button Event Handling */

const showFileButton      = document.querySelector('#show-file');
const openInDefaultButton = document.querySelector('#open-in-default');