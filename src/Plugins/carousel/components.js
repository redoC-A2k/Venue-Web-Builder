import { carousel, slide } from "./consts";

// import Splide from '@splidejs/splide';
export default (editor, opts) => {
    const domc = editor.DomComponents;
    domc.addType(slide.type, {
        isComponent: (el) => {
            if (el.classList && el.classList.contains("splide__slide")) {
                console.log(el)
                // console.log(el.classList.contains("splide"))
                return { type: slide.type }
            }
        },
        model: {
            defaults: {
                name: slide.name,
                droppable: false,
                style: {
                    ["min-height"]: '30px',
                    ["min-width"]: '100%',
                },
                attributes: {
                    "class": "splide__slide",
                },
                components: [{
                    type: "image",
                    activate: true,
                    droppable: false,
                    attributes: {
                        width: "100%",
                        height: 'auto',
                        src: 'https://source.unsplash.com/random/500x300',
                        style: {
                            width: "100%",
                            height: "auto"
                        }
                    }
                }, {
                    droppable: false,
                    type: "text",
                    content: "Your Description Here"
                }],
            }
        }
    })

    domc.addType(carousel.type, {
        isComponent: (el) => {
            if (el.classList && el.classList.contains("splide")) {
                console.log(el.tagName)
                // console.log(el.classList.contains("splide"))
                return { type: carousel.type }
            }
        },
        model: {
            defaults: {
                name: carousel.name,
                droppable: false,
                attributes: {
                    "class": "splide",
                    "aria-label": "Splide Basic HTML Example",
                },
                components: [{
                    droppable: false,
                    selectable: false,
                    layerable:false,
                    attributes: {
                        "class": "splide__track",
                    },
                    components: [{
                        attributes: {
                            "class": "splide__list",
                        },
                        droppable: true,
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
                }
                ],
                script: function () {
                    let el = this;

                    const initLib = function () {
                        let Splide = window.Splide;
                        var splide = new Splide("#" + el.id, {
                            type: "loop",
                            padding: {
                                left: "15%",
                                right: "15%",
                            },
                            gap: "1em",
                        });
                        splide.mount();
                        console.log("mounted splide")
                    }
                    if (typeof Swiper == "undefined") {
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
            }
        }
    })
}