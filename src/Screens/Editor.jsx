import { useEffect, useState } from "react";
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css'
import { Link } from "react-router-dom";
import grapesjs_blocks_basic from 'grapesjs-blocks-basic';
import grapesjs_plugin_forms from 'grapesjs-plugin-forms';

function handleTab(i) {
    // document.getElementById("tabhead").childNodes[0].classList.remove('active')
    // document.getElementById("tabhead").childNodes[1].classList.add('active')
    let list = document.getElementById("tabhead");
    list.childNodes[0].childNodes[0].classList.remove('active')
    list.childNodes[1].childNodes[0].classList.remove('active')
    list.childNodes[2].childNodes[0].classList.remove('active')
    list.childNodes[3].childNodes[0].classList.remove('active')
    list.childNodes[i].childNodes[0].classList.add('active')

    let contentList = document.getElementById("tabbody");
    contentList.childNodes[0].classList.remove('active');
    contentList.childNodes[1].classList.remove('active');
    contentList.childNodes[2].classList.remove('active');
    contentList.childNodes[3].classList.remove('active');
    contentList.childNodes[i].classList.add('active')
}

function Editor(props) {
    const [editor, setEditor] = useState(null)
    useEffect(() => {
        console.log("Mounted");
        const editor = grapesjs.init({
            container: "#gjs",
            width: "auto",
            plugins: [grapesjs_blocks_basic, grapesjs_plugin_forms],
            storageManager: {
                autoload:true,
                autosave:true,
                type: 'local',
                storeHtml:true,
                storeCss:true,
                storeComponents:true,
                contentTypeJson:true,
                id: 'gjs-custom-',             // Prefix identifier that will be used inside storing and loading
            },
            pluginsOpts: {
                [grapesjs_blocks_basic]: {
                    // flexGrid:true,
                },
                [grapesjs_plugin_forms]: {}
            },
            blockManager: {
                appendTo: '#blockdiv',
            },
            layerManager: {
                appendTo: "#layerdiv"
            },
            styleManager: {
                appendTo: "#stylediv"
            },
            traitManager: {
                appendTo: "#traitdiv"
            },
            selectorManager: {
                appendTo: "#selectdiv"
            },
            deviceManager: {
                devices: [{
                    name: "Desktop",
                    width: '',
                }, {
                    name: "Mobile",
                    width: '320px',
                    widthMedia: '480px',
                }]
            },
            panels: { defaults: {} },
            // panels: {
            //     defaults: [
            //         {
            //             id: 'basic-actions',
            //             el: '.panel__basic-actions',
            //             buttons: [{
            //                 id: 'visibility',
            //                 active: true,
            //                 className: 'btn-toggle-borders',
            //                 label: '<i class="fa-regular fa-square"></i>',
            //                 command: 'sw-visibility',
            //             }],
            //         }, {
            //             id: 'panel-devices',
            //             el: '.panel__devices',
            //             buttons: [{
            //                 id: 'device-desktop',
            //                 el: '<i class="fa-solid fa-laptop"></i>',
            //                 command: 'set-device-desktop',
            //                 active: true,
            //             }, {
            //                 id: 'device-mobile',
            //                 el: '<i class="fa-solid fa-mobile"></i>',
            //                 command: 'set-device-mobile',
            //             }]
            //         }
            //     ]
            // }
        })
        // editor.Panels.addPanel({
        //     id: 'panel-top',
        //     el: '.panel__top',
        // });
        editor.Panels.addPanel({
            id: 'basic-actions',
            el: '.panel__basic-actions',
            buttons: [
                {
                    id: 'visibility',
                    active: true, // active by default
                    label: '<i class="fa-regular fa-square"></i>',
                    command: 'sw-visibility', // Built-in command
                }, {
                    id: 'export',
                    label: '<i class="fa-solid fa-code"></i>',
                    command: 'export-template',
                    context: 'export-template', // For grouping context of buttons from the same panel
                }, {
                    id: 'show-json',
                    label: 'JSON',
                    context: 'show-json',
                    command(editor) {
                        editor.Modal.setTitle('Components JSON')
                            .setContent(`<textarea style="width:100%; height: 250px;">
                      ${JSON.stringify(editor.getComponents())}
                    </textarea>`)
                            .open();
                    },
                }
            ],
        });
        editor.Panels.addPanel({
            id: 'panel-devices',
            el: '.panel__devices',
            buttons: [{
                id: 'device-desktop',
                label: '<i class="fa-solid fa-desktop"></i>',
                command: 'set-device-desktop',
                active: true,
                togglable: false,
            }, {
                id: 'device-mobile',
                label: '<i class="fa-solid fa-mobile"></i>',
                command: 'set-device-mobile',
            }]
        })
        editor.Commands.add('set-device-desktop', {
            run: editor => editor.setDevice('Desktop')
        });
        editor.Commands.add('set-device-mobile', {
            run: editor => editor.setDevice('Mobile')
        });
        setEditor(editor)
    }, [])

    return <section id="editor">
        <div className="sidebar container-fluid">
            <ul id="tabhead" className="nav nav-tabs">
                <li className="nav-item">
                    <Link className="nav-link active" onClick={() => handleTab(0)} to="#"><i className="fa-solid fa-paintbrush"></i></Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" onClick={() => handleTab(1)} to="#"><i className="fa-solid fa-gear"></i></Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" onClick={() => handleTab(2)} to="#"><i className="fa-solid fa-layer-group"></i></Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" onClick={() => handleTab(3)} to="#"><i className="fa-solid fa-table-cells-large"></i></Link>
                </li>
            </ul>
            <div id="tabbody" className="tab-content">
                <div className="tab-pane fade active" id="style">
                    <div id="selectdiv"></div>
                    <div id="stylediv"></div>
                </div>
                <div className="tab-pane fade in" id="trait">
                    <div id="traitdiv"></div>
                </div>
                <div className="tab-pane fade in" id="layer">
                    <div id="layerdiv"></div>
                </div>
                <div className="tab-pane fade in" id="block">
                    <div id="blockdiv"></div>
                </div>
            </div>
        </div>
        <div className="main">
            <div className="topnav panel__top">
                <div className="panel__devices"></div>
                <div className="panel__basic-actions"></div>
                <div className="panel__switcher"></div>
            </div>
            <div id="gjs">
            </div>
        </div>
    </section >
}

export default Editor;