import { slick } from "./consts";

export default (editor, opts) => {
    const bm = editor.BlockManager;
    bm.add(slick.name,{
        label:slick.label,
        media:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20,11H4V9H20Zm0-4H4V5H20Zm0,8H4v2H20Z"/></svg>',
        category:'Carousel',
        content:{type:slick.type}
    })
}