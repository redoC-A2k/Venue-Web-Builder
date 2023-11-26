import  grapesjs from "grapesjs";
import gjs_blocks_basic from 'grapesjs-blocks-basic'
import gjs_plugin_froms from 'grapesjs-plugin-forms'
// const gjs_basic_blocks = require('grapesjs-basic-blocks')
    // Promise.all([
    //     import('grapesjs-blocks-basic'),
    //     // import('grapesjs-plugin-forms'),
    // ]).then((arg)=>{
    //     // console.log(arg)
    //     console.log(arg[0].default)
    // })

function getHtmlCss(data) {
    const editor = grapesjs.init({
        headless: true,
        plugins: [gjs_blocks_basic,gjs_plugin_froms],
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

// module.exports = { getHtmlCss }
export default getHtmlCss