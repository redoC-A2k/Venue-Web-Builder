import { Component, Editor } from "grapesjs";
import { carousel, image, slide, text } from "./consts";
import { PluginOptions } from '.'
import { Splide } from "@splidejs/splide/dist/types/index.d.ts";

declare module window {
    export const Splide: Splide;
    export const splide: any;
}

// import Splide from '@splidejs/splide';
export default (editor: Editor, opts: PluginOptions) => {
    const domc = editor.DomComponents;

    domc.addType(image.type, {
        isComponent: (el) => {
            if (el.classList && el.classList.contains("slide_image")) {
                return { type: image.type }
            }
        },
        extend: "image",
        model: {
            defaults: {
                attributes: {
                    width: "100%",
                    height: "auto",
                    // src: "https://source.unsplash.com/random/500x300",
                    src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2ODAuNzY0IiBoZWlnaHQ9IjUyOC4zNTQiIHZpZXdCb3g9IjAgMCAxODAuMTE5IDEzOS43OTQiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMy41OSAtNjYuNjM5KSIgcGFpbnQtb3JkZXI9ImZpbGwgbWFya2VycyBzdHJva2UiPjxwYXRoIGZpbGw9IiNkMGQwZDAiIGQ9Ik0xMy41OTEgNjYuNjM5SDE5My43MXYxMzkuNzk0SDEzLjU5MXoiLz48cGF0aCBkPSJtMTE4LjUwNyAxMzMuNTE0LTM0LjI0OSAzNC4yNDktMTUuOTY4LTE1Ljk2OC00MS45MzggNDEuOTM3SDE3OC43MjZ6IiBvcGFjaXR5PSIuNjc1IiBmaWxsPSIjZmZmIi8+PGNpcmNsZSBjeD0iNTguMjE3IiBjeT0iMTA4LjU1NSIgcj0iMTEuNzczIiBvcGFjaXR5PSIuNjc1IiBmaWxsPSIjZmZmIi8+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTI2LjExMSA3Ny42MzRoMTUyLjYxNHYxMTYuMDk5SDI2LjExMXoiLz48L2c+PC9zdmc+",
                }
            },
        }
    })

    domc.addType(text.type, {
        isComponent: (el) => {
            if (el.classList && el.classList.contains("slide_text")) {
                return { type: text.type }
            }
        },
        extend: "text",
        model: {
            defaults: {
                droppable: 'false',
                content: "Your Description Here",
            },
        }
    })

    domc.addType(slide.type, {
        isComponent: (el) => {
            if (el.classList && el.classList.contains("slide__slide")) {
                return { type: slide.type }
            }
        },
        model: {
            // remove(opts) {
            //     let el = this.getEl()?.parentElement?.parentElement?.parentElement;
            //     let component = this;
            //     let refreshCarousel = async () => {
            //         if (el) {
            //             // console.log(component.components())
            //             // console.log(component.parent()?.components())
            //             // el.innerHTML = "";
            //             // el.innerHTML = inner||"";
            //             // $(`#${el.id}`).load(document.URL + ` #${el.id}>*`);
            //             let Splide = window.Splide;
            //             // @ts-ignore
            //             let splide = new Splide(el, {
            //                 padding: {
            //                     left: "15%",
            //                     right: "15%",
            //                 },
            //                 gap: "1em",
            //             }).mount();
            //             splide.remove(component.index())
            //             // const data = editor.getProjectData();
            //             // console.log(data)
            //             let data = await editor.store()
            //             console.log(data)
            //             // splide.remove(this.index)
            //         }
            //     }
            //     if (typeof window.Splide == "undefined") {
            //         let sEl = document.createElement("script");
            //         sEl.onload = () => {
            //             refreshCarousel()
            //         }
            //         sEl.src = "https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js";
            //         document.body.appendChild(sEl);
            //     } else {
            //         refreshCarousel()
            //     }
            //     return this;
            // },
            removed() {
                // editor.Canvas.getFrameEl().src = editor.Canvas.getFrameEl().src;
                editor.loadProjectData(editor.getProjectData())
            },

            defaults: {
                name: slide.name,
                droppable: false,
                draggable: "div.splide__list",
                style: {
                    ["min-height"]: '30px',
                    ["min-width"]: '100%',
                },
                attributes: {
                    "class": "splide__slide",
                },
                components: [{
                    droppable: false,
                    type: image.type,
                    attributes: {
                        class: "slide_image"
                    }
                }, {
                    droppable: false,
                    type: text.type,
                    attributes: {
                        class: "slide_text"
                    }
                }],
            },

        },
    })

    domc.addType(carousel.type, {
        isComponent: (el) => {
            if (el.classList && el.classList.contains("carousel")) {
                // console.log(el.classList.contains("splide"))
                return { type: carousel.type }
            }
        },
        model: {
            defaults: {
                name: carousel.name,
                attributes: {
                    "class": "splide carousel",
                    "aria-label": "Splide Basic HTML Example",
                },
                droppable: false,
                components: [{
                    droppable: false,
                    selectable: false,
                    attributes: {
                        "class": "splide__track",
                    },
                    components: [{
                        attributes: {
                            "class": "splide__list",
                        },
                        droppable: "div.splide__slide",
                        components: [
                            {
                                type: slide.type,
                            },
                            {
                                type: slide.type,
                            },
                            {
                                type: slide.type,
                            }
                        ]
                    }]
                }],
                script: function () {
                    // @ts-ignore
                    let el = this as HTMLElement;

                    const initLib = function () {
                        let Splide = window.Splide;
                        try {
                            // @ts-ignore
                            var splide = new Splide(el, {
                                padding: {
                                    left: "15%",
                                    right: "15%",
                                },
                                gap: "1em",
                            });
                            splide.mount();
                        } catch (error) {
                            console.log(error)
                        }

                        // console.log(JSON.stringify(splide))
                        //@ts-ignore
                        // window.splide = splide;
                        // console.log("mounted splide",document.scripts)
                    }
                    if (typeof window.Splide == "undefined") {
                        const script = document.createElement("script");
                        script.onload = initLib;
                        script.src = "https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js";
                        document.body.appendChild(script);
                    } else {
                        initLib();
                    }
                },
                style: {
                    ["min-height"]: '30px',
                    ["min-width"]: '100%',
                },
            },
            init() {
                console.log("init carousel")
            }
        },
    })

}