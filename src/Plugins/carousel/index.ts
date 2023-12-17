import loadBlocks from './blocks';
import loadComponents from './components';
import {Plugin} from 'grapesjs';

export type PluginOptions = {
    // name:string,
    // label:string,
    // type:string,
}


const CarouselPlugin:Plugin<PluginOptions> = (editor, opts) => {
    // const options = {
    //     // Default options
    //     type:'section',
    //     name:'Carousel',
    //     label:'Carousel',
    // };
    const options={}
    
    // Load defaults
    // for (let name in options) {
    //     if (!(name in opts))
    //     opts[name] = options[name];
    // }
    
    // Add components
    loadComponents(editor, opts);
    
    // Add blocks
    loadBlocks(editor, opts);
}

export default CarouselPlugin;
