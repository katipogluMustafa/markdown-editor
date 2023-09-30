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

/* Markdown Rendering */

const marked       = require('marked');

const markdownView = document.querySelector('#markdown');
const htmlView     = document.querySelector('#html');

// Initialize the Sanitizer DOMPurify
const createDOMPurify = require('dompurify');
const { JSDOM }       = require('jsdom');
const window          = new JSDOM('').window;
const DOMPurify       = createDOMPurify(window);

/*
 * @note Marked docs recommends to parse the markdown in as follows.
 */
const parseMarkdown = (markdown) =>{
    const renderedMarkdown = marked.parse(
        contents.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/,"") // remove the most common zerowidth characters from the start of the file
    );

    return DOMPurify.sanitize(renderedMarkdown);
}

const renderMarkdownToHtml = (markdown) => {
    htmlView.innerHTML = marked.parse(markdown);
}

markdownView.addEventListener('keyup', (event)=>{
    const markdownContent = event.target.value;

    renderMarkdownToHtml(markdownContent);
});

const {ipcRenderer} = require('electron');

const openFileButton = document.querySelector('#open-file');

openFileButton.addEventListener('click', ()=>{
    ipcRenderer.invoke('getFileFromUser');
});

/* Button Event Handling */

const newFileButton       = document.querySelector('#new-file');
const saveMarkdownButton  = document.querySelector('#save-markdown');
const revertButton        = document.querySelector('#revert');
const saveHtmlButton      = document.querySelector('#save-html');
const showFileButton      = document.querySelector('#show-file');
const openInDefaultButton = document.querySelector('#open-in-default');