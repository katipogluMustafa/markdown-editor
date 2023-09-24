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

/*
 * @todo Use DOMPurify to sanitize the markdown. See https://marked.js.org/
 */
const parseMarkdown = (markdown) =>{
    marked.parse(
        contents.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/,"") // remove the most common zerowidth characters from the start of the file
    )
}

const renderMarkdownToHtml = (markdown) => {
    htmlView.innerHTML = marked.parse(markdown);
}

markdownView.addEventListener('keyup', (event)=>{
    const markdownContent = event.target.value;

    renderMarkdownToHtml(markdownContent);
});