import loadBlocks from './blocks';
import loadComponents from './components';

const CalendarPlugin = (editor, opts) => {
    const options = {
    };
    // console.log(opts)
    for (let name in options) {
        if (!(name in opts))
            opts[name] = options[name];
    }
    loadComponents(editor, opts);
    loadBlocks(editor, opts);
}

export default CalendarPlugin;