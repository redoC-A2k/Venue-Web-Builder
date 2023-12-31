import { useEffect, useRef, useState } from "react";
import grapesjs, { Component } from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css'
import { Link, useNavigate } from "react-router-dom";
import grapesjs_blocks_basic from 'grapesjs-blocks-basic';
import grapesjs_plugin_forms from 'grapesjs-plugin-forms';
import axios from 'axios'
import CarouselPlugin from "../Plugins/carousel";
import grapesjs_navbar_plugin from "grapesjs-navbar";
import CalendarPlugin from "../Plugins/calendar";
import { auth } from "../firebase";
import { hideLoader, showLoader } from "../utils/loader";
// import SlickCarouselPlugin from "../Plugins/slick";


function Editor(props) {
    const [editor, setEditor] = useState(null)
    const [preview, setPreview] = useState(false)
    const [user, setUser] = useState(null)
    // const endpoint = 'https://venue-web-builder-backend-production.up.railway.app/venue/owner/web'
    const endpoint = process.env.REACT_APP_HOSTNAME + '/venue/owner/web'
    const backendHost = process.env.REACT_APP_HOSTNAME
    const promiseUser = useRef(null)
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
    let navigate = useNavigate()

    useEffect(() => {
        showLoader()
        promiseUser.current = new Promise((resolve, reject) => {
            auth.onAuthStateChanged((user) => {
                if (user) {
                    setUser(user)
                    console.log(user)
                    resolve(user);
                    hideLoader()
                }
                else {
                    navigate('/login')
                    reject("user not signed in")
                    hideLoader()
                }
            })
        })

        promiseUser.current.then(async user => {
            if (user != null) {
                let token = await user.getIdToken();
                let response = await axios.get(backendHost + '/venue/web/setup',{
                    headers:{
                        Authorization:token
                    }
                })
                if(response.data.setup==false)
                navigate('/steps')
            }
        }).catch(error=> {
            console.log(error)
            navigate('/login')
        })

        const editor = grapesjs.init({
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
                // scripts:["https://cdn.jsdelivr.net/npm/fullcalendar@6.1.9/index.global.min.js"]
                scripts: ["https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js", "https://cdn.jsdelivr.net/npm/fullcalendar@6.1.9/index.global.min.js", "https://code.jquery.com/jquery-3.7.1.slim.min.js"],
                styles: ["https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/css/splide.min.css", "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"]
            },
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
                    await promiseUser.current.then(async user => {
                        if (user != null) {
                            let token = await user.getIdToken()
                            let response = await axios.get(endpoint, {
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: token
                                }
                            });
                            editor.loadData(response.data)
                            console.log(response.data)
                            return response.data
                        }
                    })
                } catch (error) {
                    // alert("There might be some issue with your internet")
                    console.log(error)
                    navigate('/login')
                }
            },

            async store(edData) {
                try {
                    promiseUser.current.then(async user => {
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
                    })
                } catch (error) {
                    alert("There might be some issue with your internet")
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

        // editor.on('component:slide:update',component=>{
        //     console.log(component)
        // })
        // This is our custom script (avoid using arrow functions)
        // const script = function () {
        //     alert('Hi');
        //     // `this` is bound to the component element
        //     // console.log('the element', this.id);
        // };

        // // Define a new custom component
        // editor.Components.addType('comp-with-js', {
        //     model: {
        //         defaults: {
        //             script,
        //             // Add some style, just to make the component visible
        //             style: {
        //                 width: '100px',
        //                 height: '100px',
        //                 background: 'red',
        //             }
        //         }
        //     }
        // });

        // // Create a block for the component, so we can drop it easily
        // editor.Blocks.add('test-block', {
        //     label: 'Test block',
        //     attributes: { class: 'fa fa-text' },
        //     content: { type: 'comp-with-js' },
        // });

        setEditor(editor)
    }, [])

    async function publish() {
        console.log("publish")
        let formData = {
            html: editor.getHtml(),
            css: editor.getCss(),
        }
        showLoader();
        try {
            let token = await user.getIdToken()
            let res = await axios.post(backendHost + "/venue/publish", formData, {
                headers: {
                    "Authorization": token
                }
            })
            console.log(res.data)
            hideLoader();
        } catch (error) {
            if (error.response)
                console.log(error.response.data)
            else console.log(error)
            hideLoader()
        }

    }

    async function manage(){
        navigate('/manage')
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
                    <button onClick={manage}>MANAGE</button>
                </div>
                {/* <div className="panel__switcher"></div> */}
            </div>
            <div id="gjs">
            </div>
        </div>
    </section >
}

export default Editor;