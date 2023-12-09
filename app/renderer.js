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

function updateUserInterface()
{
    let title = 'Ktpql';
    
    if(window.appWindow && window.path)
    {
        if(filePath)
        {
            title = `${window.path.getBase(filePath)} - ${title}`;
        }

        window.appWindow.setTitle(title);
    }
}

const saveMarkdownButton  = document.querySelector('#save-markdown');
const revertButton        = document.querySelector('#revert');

function updateUserInterfaceAsEdited()
{
    if(window.appWindow)
    {
        window.appWindow.setEdited();
    }

    saveMarkdownButton.disabled = false;
    revertButton.disabled       = false;
}

function updateUserInterfaceAsNoChange()
{
    saveMarkdownButton.disabled = true;
    revertButton.disabled       = true;
}

/* Markdown Rendering */

const markdownView = document.querySelector('#markdown');
const htmlView     = document.querySelector('#html');

markdownView.addEventListener('keyup', (event)=>{
    const markdownContent = event.target.value;
    
    if(window.backend)
    {
        window.backend.renderMarkdownToHtml(markdownContent).then(result=>
        {
            htmlView.innerHTML = result;
        });
    }

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
    if(window.backend)
    {
        window.backend.getFileFromUser();
    }
});

const onFileOpened = (event, file, content) =>{
    filePath          = file;
    fileCachedContent = content;

    markdownView.value = content;

    if(window.backend)
    {
        window.backend.renderMarkdownToHtml(content).then(result=>
        {
            htmlView.innerHTML = result;
        });
    }

    updateUserInterface();
};

if(window.backend)
{
    window.backend.setFileOpenHandler(onFileOpened);
}

/* Feature: New File */

const newFileButton       = document.querySelector('#new-file');

newFileButton.addEventListener('click', ()=>{
    if(window.appWindow)
    {
        window.appWindow.create();
    }
});

/* Feature: Save File */
const saveHtmlButton      = document.querySelector('#save-html');
saveHtmlButton.addEventListener('click', ()=>{
    let htmlContent = htmlView.innerHTML;
    if(window.backend)
    {
        window.backend.exportAsHtml(htmlContent);
    }
});


/* Feature: Save as Markdown File */
saveMarkdownButton.addEventListener('click', ()=>{
    let fileContent = markdownView.value;
    if(window.backend)
    {
        window.backend.ExportAsMarkdown(filePath, fileContent);
    }
});

/* Feature: Revert File Contents */
revertButton.addEventListener('click', ()=>{
    markdownView.value = fileCachedContent;

    if(window.backend)
    {
        window.backend.renderMarkdownToHtml(fileCachedContent).then(result=>
        {
            htmlView.innerHTML = result;
        });
    }
});


/* Button Event Handling */

const showFileButton      = document.querySelector('#show-file');
const openInDefaultButton = document.querySelector('#open-in-default');