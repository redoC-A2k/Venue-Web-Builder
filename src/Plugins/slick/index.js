import loadComponents from './components';
import loadBlocks from './blocks'

const SlickCarouselPlugin = (editor, opts) => {
    const options = {}
    loadComponents(editor, opts);
    loadBlocks(editor, opts);
}

export default SlickCarouselPlugin;