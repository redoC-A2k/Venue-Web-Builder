import { useEffect, useState } from "react"
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';

function Editor(props) {
    const [editor, setEditor] = useState(null);
    useEffect(() => {
        console.log("Mounted Editor")
        const editor = grapesjs.init({
            layerManager: {
                appendTo: '.layers-container'
            },
            container: '#gjs',
            // components: '<h1>Hello world component</h1>',
            // height: '300px',
            width: 'auto',
            storageManager: {
                type: 'local', // Type of the storage, available: 'local' | 'remote'
                autosave: true, // Store data automatically
                autoload: true, // Autoload stored data on init
                stepsBeforeSave: 1, // If autosave enabled, indicates how many changes are necessary before store method is triggered
                options: {
                    local: { // Options for the `local` type
                        key: 'gjsProject', // The key for the local storage
                    },
                }
            },
            panels: {
                defaults:{}
                // defaults: [
                //     {
                //         id: 'layers',
                //         el: '.panel__right',
                //         // Make the panel resizable
                //         resizable: {
                //             maxDim: 350,
                //             minDim: 200,
                //             tc: 0, // Top handler
                //             cl: 1, // Left handler
                //             cr: 0, // Right handler
                //             bc: 0, // Bottom handler
                //             // Being a flex child we need to change `flex-basis` property
                //             // instead of the `width` (default)
                //             keyWidth: 'flex-basis',
                //         },
                //     },
                //     {
                //         id: 'panel-switcher',
                //         el: '.panel__switcher',
                //         buttons: [{
                //             id: 'show-layers',
                //             active: true,
                //             label: 'Layers',
                //             command: 'show-layers',
                //             // Once activated disable the possibility to turn it off
                //             togglable: false,
                //         }, {
                //             id: 'show-style',
                //             active: true,
                //             label: 'Styles',
                //             command: 'show-styles',
                //             togglable: false,
                //         },
                //         {
                //             id: 'show-traits',
                //             active: true,
                //             label: 'Traits',
                //             command: 'show-traits',
                //             togglable: false,
                //         }],
                //     },
                //     {
                //         id: 'panel-devices',
                //         el: '.panel__devices',
                //         buttons: [{
                //             id: 'device-desktop',
                //             label: 'D',
                //             command: 'set-device-desktop',
                //             active: true,
                //             togglable: false,
                //         }, {
                //             id: 'device-mobile',
                //             label: 'M',
                //             command: 'set-device-mobile',
                //             togglable: false,
                //         }],
                //     }

                // ]
            },
            blockManager: {
                appendTo: '#blocks',
                blocks: [
                    {
                        id: 'section', // id is mandatory
                        label: '<b>Section</b>', // You can use HTML/SVG inside labels
                        attributes: { class: 'gjs-block-section' },
                        content: `<section>
                            <h1>This is a simple title</h1>
                            <div>This is just a Lorem text: Lorem ipsum dolor sit amet</div>
                        </section>`,
                    },
                    {
                        id: 'text',
                        label: 'Text',
                        content: '<div data-gjs-type="text">Insert your text here</div>',
                    },
                    {
                        id: 'image',
                        label: 'Image',
                        select: true,
                        content: { type: 'image' },
                    }
                ]
            },
            selectorManager: {
                appendTo: '.styles-container'
            },

            styleManager: {
                appendTo: '.styles-container',
                sectors: [{
                    name: 'Dimension',
                    open: false,
                    // Use built-in properties
                    buildProps: ['width', 'min-height', 'padding'],
                    // Use `properties` to define/override single property
                    properties: [
                        {
                            // Type of the input,
                            // options: integer | radio | select | color | slider | file | composite | stack
                            type: 'integer',
                            name: 'The width', // Label for the property
                            property: 'width', // CSS property (if buildProps contains it will be extended)
                            units: ['px', '%'], // Units, available only for 'integer' types
                            defaults: 'auto', // Default value
                            min: 0, // Min value, available only for 'integer' types
                        }
                    ]
                }, {
                    name: 'Extra',
                    open: false,
                    buildProps: ['background-color', 'box-shadow', 'custom-prop'],
                    properties: [
                        {
                            id: 'custom-prop',
                            name: 'Custom Label',
                            property: 'font-size',
                            type: 'select',
                            defaults: '32px',
                            // List of options, available only for 'select' and 'radio'  types
                            options: [
                                { value: '12px', name: 'Tiny' },
                                { value: '18px', name: 'Medium' },
                                { value: '32px', name: 'Big' },
                            ],
                        }
                    ]
                }]
            },
            traitManager: {
                appendTo: '.traits-container',
            },
            deviceManager: {
                devices: [{
                    name: 'Desktop',
                    width: '', // default size
                }, {
                    name: 'Mobile',
                    width: '320px', // this value will be used on canvas width
                    widthMedia: '480px', // this value will be used in CSS @media
                }]
            },
        })
        editor.BlockManager.add('my-block-id', {
            label: 'Custom block',
            content: {
                tagName: 'div',
                draggable: true,
                attributes: { 'some-attribute': 'some-value' },
                components: [
                    {
                        tagName: 'span',
                        content: '<b>Some static content</b>',
                    }, {
                        tagName: 'div',
                        // use `content` for static strings, `components` string will be parsed
                        // and transformed in Components
                        components: '<span>HTML at some point</span>',
                    }
                ]
            }
        })
        editor.Panels.addPanel({
            id: 'panel-top',
            el: '.panel__top',
        });
        editor.Panels.addPanel({
            id: 'basic-actions',
            el: '.panel__basic-actions',
            buttons: [
                {
                    id: 'visibility',
                    active: true, // active by default
                    className: 'btn-toggle-borders',
                    label: '<u>B</u>',
                    command: 'sw-visibility', // Built-in command
                },
                {
                    id: 'export',
                    className: 'btn-open-export',
                    label: 'Exp',
                    command: 'export-template',
                    context: 'export-template', // For grouping context of buttons from the same panel
                },
                {
                    id: 'show-json',
                    className: 'btn-show-json',
                    label: 'JSON',
                    context: 'show-json',
                    command: (editor) => {
                        editor.Modal.setTitle('Components JSON')
                            .setContent(`<textarea style="width:100%; height: 250px;">
                                ${JSON.stringify(editor.getComponents())}
                            </textarea>`)
                            .open();
                    }
                }
            ]
        })
        // editor.on('run:export-template:before', opts => {
        //     console.log('Before the command run');
        //     if (1 /* some condition */) {
        //         opts.abort = 1;
        //     }
        // });
        // editor.on('run:export-template', () => console.log('After the command run'));
        // editor.on('abort:export-template', () => console.log('Command aborted'));

        editor.Commands.add('show-layers', {
            getRowEl(editor) { return editor.getContainer().closest('.editor-row'); },
            getLayersEl(row) { return row.querySelector('.layers-container') },

            run(editor, sender) {
                const lmEl = this.getLayersEl(this.getRowEl(editor));
                lmEl.style.display = '';
            },
            stop(editor, sender) {
                const lmEl = this.getLayersEl(this.getRowEl(editor));
                lmEl.style.display = 'none';
            },
        });
        editor.Commands.add('show-styles', {
            getRowEl(editor) { return editor.getContainer().closest('.editor-row'); },
            getStyleEl(row) { return row.querySelector('.styles-container') },

            run(editor, sender) {
                const smEl = this.getStyleEl(this.getRowEl(editor));
                smEl.style.display = '';
            },
            stop(editor, sender) {
                const smEl = this.getStyleEl(this.getRowEl(editor));
                smEl.style.display = 'none';
            },
        });
        editor.Commands.add('show-traits', {
            getTraitsEl(editor) {
                const row = editor.getContainer().closest('.editor-row');
                return row.querySelector('.traits-container');
            },
            run(editor, sender) {
                this.getTraitsEl(editor).style.display = '';
            },
            stop(editor, sender) {
                this.getTraitsEl(editor).style.display = 'none';
            },
        });
        editor.Commands.add('set-device-desktop', {
            run: editor => editor.setDevice('Desktop')
        });
        editor.Commands.add('set-device-mobile', {
            run: editor => editor.setDevice('Mobile')
        });


        setEditor(editor)
        console.log("Bye")
    }, [])

    return <section id="Editor">
        <div className="panel__top">
            <div className="panel__basic-actions"></div>
            <div className="panel__devices"></div>
            <div className="panel__switcher"></div>
        </div>
        <div className="editor-row">
            <div className="editor-canvas">
                <div id="gjs">
                    <h1>Hello world component</h1>
                </div>
            </div>
            <div className="panel__right">
                <div className="layers-container"></div>
                <div className="styles-container"></div>
                <div className="traits-container"></div>
            </div>
        </div>
        <div id="blocks"></div>

    </section>

}
export default Editor