const MarkdownSaveButton   = document.querySelector('#save-markdown');
const MarkdownRevertButton = document.querySelector('#revert');

function updateUserInterfaceAsEdited()
{
    if(window.appWindow)
    {
        window.appWindow.setEdited();
    }

    MarkdownSaveButton.disabled   = false;
    MarkdownRevertButton.disabled = false;
}

function updateUserInterfaceAsNoChange()
{
    MarkdownSaveButton.disabled   = true;
    MarkdownRevertButton.disabled = true;
}

const markdownViewKeyUpHandler = (event)=>{
    const markdownContent = event.target.value;
    
    if(window.markdownDocument)
    {
        window.markdownDocument.render(markdownContent).then(result=>
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
}