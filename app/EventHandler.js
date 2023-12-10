
let filePath          = null;
let fileCachedContent = null;

const handleNewFile = ()=>{
    if(window.appWindow)
    {
        window.appWindow.create();
    }
}

const renderFile = (file, content) => {
    filePath          = file;
    fileCachedContent = content;

    markdownView.value = content;

    if(window.markdownDocument)
    {
        window.markdownDocument.render(content).then(result=>{
            htmlView.innerHTML = result;
        });

        window.markdownDocument.watch(filePath);
    }
}

const onFileOpened = (event, file, content) =>{
    if(window.userDialog)
    {
        window.userDialog.askShouldDiscardUponFileOpen().then(result => {
            if(result)
            {
                renderFile(file, content);
            }
        });
    }
};

const onFileChanged = (event, file, content) =>{
    if(window.userDialog)
    {
        window.userDialog.askShouldDiscardUponOverwrite().then(result => {
            if(result)
            {
                renderFile(file, content);
            }
        });
    }
};

const handleRevertFile = ()=>{
    markdownView.value = fileCachedContent;

    if(window.markdownDocument)
    {
        window.markdownDocument.render(fileCachedContent).then(result=>
        {
            htmlView.innerHTML = result;
        });
    }
}

const handleSaveFile = (event) => {
    let fileContent = markdownView.value;
    if(window.markdownDocument)
    {
        window.markdownDocument.export(filePath, fileContent);
    }
}

const handleSaveHtml = () => {
    let htmlContent = htmlView.innerHTML;
    if(window.htmlDocument)
    {
        window.htmlDocument.export(htmlContent);
    }
}

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

const handleOpenFile = ()=>{
    let file = null;

    if(window.userDialog)
    {
        window.userDialog.getFile().then(result=>{
            file = result;

            if(null != file)
            {
                if(window.markdownDocument)
                {
                    window.markdownDocument.load(file);
                }
            }
        });
    }
}
