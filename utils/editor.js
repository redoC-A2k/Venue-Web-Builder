const grapesjs = require('grapesjs');

function getHtmlCss(data){
    const editor = grapesjs.init({
        headless: true,
    })
    editor.loadData(data)
    const pagesHtml = editor.Pages.getAll().map(page => {
        const component = page.getMainComponent();
        return {
            html: editor.getHtml({ component }),
            css: editor.getCss({ component })
        }
    });
    return pagesHtml;
}

module.exports = {getHtmlCss}
// getHtml(data)