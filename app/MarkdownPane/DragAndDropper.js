
/* Feature: Markdown Document Drag and Drop
 *
 * This source file implements drag and drop feature for markdown pane.
 */

const markdownPanel = document.querySelector('#markdown');

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

markdownPanel.addEventListener('dragover', (event) => {
    const file = getDraggedFile(event);

    if(isSupportedFileType(file))
    {
        markdownPanel.classList.add('drag-over');
    }
    else
    {
        markdownPanel.classList.add('drag-error');
    }
});

markdownPanel.addEventListener('dragleave', ()=> {
    markdownPanel.classList.remove('drag-over');
    markdownPanel.classList.remove('drag-error');
});

markdownPanel.addEventListener('drop', (event)=>{
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

    markdownPanel.classList.remove('drag-over');
    markdownPanel.classList.remove('drag-error');
});