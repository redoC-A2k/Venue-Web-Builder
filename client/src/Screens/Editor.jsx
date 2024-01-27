import { useContext, useEffect, useRef, useState } from "react";
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css'
import { Link, useNavigate } from "react-router-dom";
import grapesjs_blocks_basic from 'grapesjs-blocks-basic';
import grapesjs_plugin_forms from 'grapesjs-plugin-forms';
import axios from 'axios'
import CarouselPlugin from "../Plugins/carousel";
import grapesjs_navbar_plugin from "grapesjs-navbar";
import CalendarPlugin from "../Plugins/calendar";
import { hideLoader, showLoader } from "../utils/loader";
import toast from 'react-hot-toast'
import { globalContext } from '../App'


function Editor(props) {
    let editor = undefined;
    const [preview, setPreview] = useState(false)
    const endpoint = process.env.REACT_APP_HOSTNAME + '/venue/owner/web'
    function handleTab(i) {
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

    const navigate = useNavigate()
    const { user, stepsData } = useContext(globalContext)
    console.log("rendering editor")
    useEffect(() => {
        if (editor == undefined && user != undefined) {
            editor = grapesjs.init({
                container: "#gjs",
                width: "auto",
                height: "95vh",
                plugins: [grapesjs_blocks_basic, grapesjs_plugin_forms, CarouselPlugin, grapesjs_navbar_plugin, CalendarPlugin],
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
                    [grapesjs_plugin_forms]: {},
                    [CarouselPlugin]: {},
                    [grapesjs_navbar_plugin]: {},
                    [CalendarPlugin]: {},
                    // [SlickCarouselPlugin]: {}
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
                panels: { defaults: false },
                assetManager: {
                    upload: `https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_IMG}`,
                    uploadName: 'source',
                    multiUpload: false,
                    assets: [
                        {
                            type: "image",
                            src: 'https://source.unsplash.com/random/500x300/?img=1',
                            height: "auto",
                            width: "100%",
                            name: 'image1'
                        },
                        {
                            type: "image",
                            src: 'https://source.unsplash.com/random/600x400/?img=1',
                            height: 400,
                            width: 600,
                            name: 'image2'
                        },
                        {
                            type: "image",
                            src: 'https://source.unsplash.com/random/700x500/?img=1',
                            height: 500,
                            width: 700,
                            name: 'image3'
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
                        const data = editor.getProjectData();
                        editor.StorageManager.store(data);
                        // return {data:[imgObj]}
                    }
                },
                canvas: {
                    // scripts: ["https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js", "https://cdn.jsdelivr.net/npm/fullcalendar@6.1.9/index.global.min.js", "https://code.jquery.com/jquery-3.7.1.slim.min.js"],
                    scripts: ["https://cdn.jsdelivr.net/npm/@redoc_a2k/splide@4.1.4/dist/js/splide.min.js", "https://cdn.jsdelivr.net/npm/fullcalendar@6.1.9/index.global.min.js"],
                    styles: ["https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/css/splide.min.css", "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"]
                },
            })

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
                        context: 'show borders'
                    }, {
                        id: 'export',
                        label: '<i class="fa-solid fa-code"></i>',
                        command: 'export-template',
                        context: 'export-template', // For grouping context of buttons from the same panel
                    }, {
                        id: 'preview',
                        label: '<i class="fa-solid fa-eye"></i>',
                        command: 'preview',
                        context: 'preview'
                    },
                    // {
                    //     id: 'show-json',
                    //     label: 'JSON',
                    //     context: 'show-json',
                    //     command(editor) {
                    //         editor.Modal.setTitle('Components JSON')
                    //             .setContent(`<textarea style="width:100%; height: 250px;">
                    //       ${JSON.stringify(editor.getComponents())}
                    //     </textarea>`)
                    //             .open();
                    //     },
                    // }
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
            editor.on('run:preview', async () => {
                // console.log("preview")
                await setPreview(true)
                let topnav = document.querySelector('#editor div.main div.topnav')
                topnav.style.display = "none"
                topnav.style.height = "0"
                let sidebar = document.querySelector('#editor div.sidebar')
                sidebar.style.display = "none"
                let main = document.querySelector('#editor div.main')
                main.style.width = "100%"
            })
            editor.on('stop:preview', async () => {
                await setPreview(false)
                let topnav = document.querySelector('#editor div.main div.topnav')
                topnav.style.display = "flex"
                topnav.style.height = "3.6rem"
                let sidebar = document.querySelector('#editor div.sidebar')
                sidebar.style.display = "initial"
                let main = document.querySelector('#editor div.main')
                main.style.width = "calc(100vw - 20rem)"
            })

            editor.Storage.add('remote', {
                async load() {
                    try {
                        if (user != undefined) {
                            let token = await user.getIdToken()
                            let response = await axios.get(endpoint, {
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: token
                                }
                            });
                            editor.loadData(response.data)
                            console.log(response.data)
                            hideLoader()
                            return response.data
                        }
                    } catch (error) {
                        // alert("There might be some issue with your internet")
                        if (error.response && error.response.data)
                            console.log(error.response.data)
                        else console.log(error)
                        navigate('/login')
                    }
                },

                async store(edData) {
                    try {
                        if (user != undefined) {
                            if (user != null) {
                                let token = await user.getIdToken();
                                let message = await axios.post(endpoint, edData, {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: token
                                    }
                                });
                                console.log(message.data)
                            }
                        }
                    } catch (error) {
                        if (error.response.data)
                            console.log(error.response.data)
                        else console.log(error)
                        // alert("There might be some issue with your internet")
                    }
                },
            });

            // prevent adding more than two calendar
            editor.on('component:add', component => {
                // console.log("component event")
                // if (component.attributes.type === "slide") {
                //     let el = component.parent().parent().parent().getEl();
                //     // console.log(el.id)
                //     // function load(target, url) {
                //     //     console.log(url)
                //     //     var r = new XMLHttpRequest();
                //     //     r.open("GET", url, true);
                //     //     r.onreadystatechange = function () {
                //     //         if (r.readyState != 4 || r.status != 200) return;
                //     //         console.log(r.responseText)
                //     //         // target.innerHTML = r.responseText;
                //     //     };
                //     //     r.send();
                //     // }
                //     let url = window.location.href+"#"+el.id;
                //     axios.get(url).then(res=>{console.log(res.data)}).catch(err=>console.log(err))
                //     // load(el,url)
                //     // component.parent().parent().parent().getEl().innerHTML = el;
                // }

                if (component.attributes.type === "calendar") {
                    if (editor.getWrapper().find('div.fc').length > 0) {
                        component.remove();
                    }
                    // console.log("wrapper run")
                }
            })
        }

    }, [user, stepsData])

    async function publish() {
        let formData = {
            html: editor.getHtml(),
            css: editor.getCss(),
        }
        showLoader();
        try {
            let token = await user.getIdToken()
            let res = await axios.post(process.env.REACT_APP_HOSTNAME + "/venue/publish", formData, {
                headers: {
                    "Authorization": token
                }
            })
            console.log(res.data)
            toast(
                (toastId) => (
                    <span>
                        View Published website
                        <button style={{ padding: "2px", marginLeft: "4px", border: "1px solid black" }} onClick={() => {
                            window.open(process.env.REACT_APP_HOSTNAME + '/website/' + stepsData.slug)
                        }}>🌐</button>
                    </span>
                ),
                { duration: 2000 }
            );
            hideLoader();
        } catch (error) {
            if (error.response)
                console.log(error.response.data)
            else console.log(error)
            hideLoader()
        }

    }

    function queries() {
        navigate('/queries')
    }

    function events() {
        navigate('/events')
    }

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
                <div className="custom__actions">
                    <button onClick={publish}>PUBLISH</button>
                    <button onClick={queries}>QUERIES</button>
                    <button onClick={events}>EVENTS</button>
                </div>
                {/* <div className="panel__switcher"></div> */}
            </div>
            <div id="gjs">
            </div>
        </div>
    </section >
}

export default Editor;