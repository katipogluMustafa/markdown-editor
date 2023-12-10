
let filePath          = null;
let fileCachedContent = null;

const handleNewFile = ()=>{
    if(window.appWindow)
    {
        window.appWindow.create();
    }
}

const handleOpenInNewWindow = ()=>{
    if(window.appWindow)
    {
        window.appWindow.openInNewWindow();
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

    openInDefaultButton.disabled = false;
    showFileButton.disabled = false;
}

const showFileInExplorer = () => {
    if(!filePath)
    {
        return alert('The file has not been saved to a file.');
    }

    if(window.osExplorer)
    {
        window.osExplorer.reveal(filePath);
    }
}

const openInDefaultApp = () => {
    if(!filePath)
    {
        return alert('The file has not been saved to a file.');
    }

    if(window.osDefaultApp)
    {
        window.osDefaultApp.openMarkdown(filePath);
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
