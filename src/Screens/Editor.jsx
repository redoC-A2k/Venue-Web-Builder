import { useRef, useEffect, useState } from "react";
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css'
import { Link } from "react-router-dom";
import grapesjs_blocks_basic from 'grapesjs-blocks-basic';
import grapesjs_plugin_forms from 'grapesjs-plugin-forms';
// import grapesjs_plugin_carousel from "grapesjs-plugin-carousel"
import axios from 'axios'


function Editor(props) {
    const [editor, setEditor] = useState(null)
    const endpoint = 'https://venue-web-builder-backend-production.up.railway.app/venue/owner/web'
    // const endpoint = 'http://localhost:4000/venue/owner/web'

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

        // console.log(editor.getProjectData())
    }

    useEffect(() => {
        console.log("Mounted");
        const editor = grapesjs.init({
            container: "#gjs",
            width: "auto",
            plugins: [grapesjs_blocks_basic, grapesjs_plugin_forms],
            storageManager: {
                autoload: true,
                autosave: true,
                contentTypeJson: true,
                id: 'gjs-custom-',             // Prefix identifier that will be used inside storing and loading
                type: 'remote',
                onStore: (data, editor) => data,
                // If on load, you're returning the same JSON from above...
                onLoad: result => result,
            },
            pluginsOpts: {
                [grapesjs_blocks_basic]: {
                    // flexGrid:true,
                },
                // [grapesjs_plugin_carousel]:{},
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
            assetManager: {
                upload: `https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_IMG}`,
                uploadName: 'source',
                multiUpload: false,
                assets: [
                    {
                        src: 'https://picsum.photos/500/300',
                        height: 300,
                        width: 500,
                        name: 'image1'
                    },
                    {
                        src: 'https://picsum.photos/600/400',
                        height: 400,
                        width: 600,
                        name: 'image2'
                    },
                ],
                uploadFile: async (e) => {
                    console.log(e);
                    var files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
                    // ...send somewhere
                    console.log(files);
                    let formData = new FormData();
                    formData.append('image', files[0]);
                    const res = await axios.post(
                        `https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_IMG}`,
                        formData,
                        {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        })
                    console.log(res.data.data);
                    let imgObj = {
                        src: res.data.data.display_url,
                        width: res.data.data.width,
                        height: res.data.data.height,
                        name: res.data.data.image.name,
                    };
                    console.log("added to asset manager", imgObj)
                    editor.AssetManager.add([imgObj]);
                }
            }
        })
        // editor.Panels.addPanel({
        //     id: 'panel-top',
        //     el: '.panel__top',
        // });
        // asset manager


        // Panels Configuration
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

        // configuring StorageManager
        editor.Storage.add('remote', {
            async load() {
                try {
                    let response = await axios.get(endpoint, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    console.log(response.data)
                    return response.data.data
                } catch (error) {
                    alert("There might be some issue with your internet")
                }
            },

            async store(edData) {
                try {
                    let message = await axios.post(endpoint, edData);
                    console.log(message.data)
                    return "Success"
                } catch (error) {
                    alert("There might be some issue with your internet")
                }

            },
        });

        // editor.on('asset:upload:start', () => {
        //     console.log("upload start");
        // });

        // // The upload is ended (completed or not)
        // editor.on('asset:upload:end', () => {
        //     console.log("Upload end");
        // });

        // // Error handling
        // editor.on('asset:upload:error', (err) => {
        //     console.log("error - occured", err);
        // });

        // // Do something on response
        // editor.on('asset:upload:response', (response) => {
        //     let result = response.data.data;
        //     return {
        //         src: result.display_url,
        //         width: result.width,
        //         height: result.height,
        //         type: result.image.mime,
        //         title: result.image.name,
        //         name: result.image.name,
        //     }
        // });

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