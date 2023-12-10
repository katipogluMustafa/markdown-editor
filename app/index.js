/* Resizeable Markdown & HTML Columns */

const rawMarkdown  = document.querySelector('.raw-markdown');
const renderedHtml = document.querySelector('.rendered-html'); 

/* Markdown Rendering */
const markdownView = document.querySelector('#markdown');
const htmlView     = document.querySelector('#html');

markdownView.addEventListener('keyup', markdownViewKeyUpHandler);

/* Feature: Open File*/

const openFileButton = document.querySelector('#open-file');
openFileButton.addEventListener('click', handleOpenFile);

/* Feature: New File */

const newFileButton = document.querySelector('#new-file');
newFileButton.addEventListener('click', handleNewFile);

/* Feature: Save File */
const saveHtmlButton = document.querySelector('#save-html');
saveHtmlButton.addEventListener('click', handleSaveHtml);

/* Feature: Save as Markdown File */
const saveMarkdownButton  = document.querySelector('#save-markdown');
saveMarkdownButton.addEventListener('click', handleSaveFile);

/* Feature: Revert File Contents */
const revertButton        = document.querySelector('#revert');
revertButton.addEventListener('click', handleRevertFile);

/* Button Event Handling */

const showFileButton      = document.querySelector('#show-file');
showFileButton.addEventListener('click', showFileInExplorer);

const openInDefaultButton = document.querySelector('#open-in-default');
openInDefaultButton.addEventListener('click', openInDefaultApp);