
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

const saveMarkdownButton  = document.querySelector('#save-markdown');
const revertButton        = document.querySelector('#revert');

/* Markdown Rendering */

const markdownView = document.querySelector('#markdown');
const htmlView     = document.querySelector('#html');

markdownView.addEventListener('keyup', markdownViewKeyUpHandler);

const openFileButton = document.querySelector('#open-file');


openFileButton.addEventListener('click', handleOpenFile);

/* Feature: New File */

const newFileButton = document.querySelector('#new-file');

newFileButton.addEventListener('click', handleNewFile);

/* Feature: Save File */
const saveHtmlButton = document.querySelector('#save-html');


saveHtmlButton.addEventListener('click', handleSaveHtml);

/* Feature: Save as Markdown File */
saveMarkdownButton.addEventListener('click', handleSaveFile);

/* Feature: Revert File Contents */
revertButton.addEventListener('click', handleRevertFile);

/* Button Event Handling */

const showFileButton      = document.querySelector('#show-file');
const openInDefaultButton = document.querySelector('#open-in-default');

/* Feature: Markdown Document Drag and Drop*/
document.addEventListener('dragstart', event => event.preventDefault());
document.addEventListener('dragover',  event => event.preventDefault());
document.addEventListener('dragleave', event => event.preventDefault());
document.addEventListener('drop',      event => event.preventDefault());

const isNonEmptyString = (str)=>
{
    return null != str && '' != str.trim();
}

const isSupportedFileExtension = (fileName) =>
{
    let result = false;

    if(isNonEmptyString(fileName))
    {
        let supportedExtensions = ['.md', '.txt'];
        let fileExtension = fileName.slice(((fileName.lastIndexOf(".") - 1) >>> 0) + 2);
    
        if(supportedExtensions.includes('.' + fileExtension.toLowerCase()))
        {
            result = true;
        }    
    }
    
    return result;
}

const isSupportedFileType = (file) => {
    let result = false;

    if(['text/plain', 'text/markdown'].includes(file.type))
    {
        result = true;
    }
    else if(isSupportedFileExtension(file.name))
    {
         result = true;
    }
    else
    {
        result = false;
    }

    return result;
}

const getDraggedFile = (event) => event.dataTransfer.items[0];
const getDroppedFile = (event) => event.dataTransfer.files[0];

markdownView.addEventListener('dragover', (event) => {
    const file = getDraggedFile(event);

    if(isSupportedFileType(file))
    {
        markdownView.classList.add('drag-over');
    }
    else
    {
        markdownView.classList.add('drag-error');
    }
});

markdownView.addEventListener('dragleave', ()=> {
    markdownView.classList.remove('drag-over');
    markdownView.classList.remove('drag-error');
});

markdownView.addEventListener('drop', (event)=>{
    const file = getDroppedFile(event);
    
    if(isSupportedFileType(file))
    {
        if(window.markdownDocument)
        {
            window.markdownDocument.load(file.path);
        }
    }
    else
    {
        alert('The '+ file.type + ' file type is not supported.');
    }

    markdownView.classList.remove('drag-over');
    markdownView.classList.remove('drag-error');
});