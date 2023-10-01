const marked       = require('marked');

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
        markdown.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/,"") // remove the most common zerowidth characters from the start of the file
    );

    return DOMPurify.sanitize(renderedMarkdown);
}

module.exports.parseMarkdownToHtml = (markdown) =>
{
    return parseMarkdown(markdown);
}