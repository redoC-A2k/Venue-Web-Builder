import { slick } from './consts'
export default (editor, opts) => {
    const domc = editor.DomComponents;
    domc.addType(slick.type, {
        isComponent: (el) => {
            if (el.classList && el.classList.contains("slick-slider")) {
                return { type: slick.type }
            }
        },
        model: {
            defaults: {
                name: slick.name,
                attributes:{
                    class:"slick-carousel"
                },
                components: [
                    {
                        attributes: {
                            "class": "slick-slide",
                        },
                        // components: [{
                        //     type: "image",
                        //     attributes: {
                        //         src: "https://source.unsplash.com/random/500x300"
                        //     }
                        // }]
                        components: [{
                            tagName:"h3",
                            content:"Slide 1",
                        }]
                    },
                    {
                        attributes: {
                            "class": "slick-slide",
                        },
                        components: [{
                            tagName:"h3",
                            content:"Slide 2",
                        }]
                    },
                    {
                        attributes: {
                            "class": "slick-slide",
                        },
                        // components: [{
                        //     type: "image",
                        //     attributes: {
                        //         src: "https://source.unsplash.com/random/500x300"
                        //     }
                        // }]
                        components: [{
                            tagName:"h3",
                            content:"Slide 3",
                        }]
                    }
                ],
                script: function () {
                    const el = this;
                    const initLib = function () {
                        let $ = window.$;
                        $('div.slick-carousel').slick({
                            centerMode: true,
                            centerPadding: '200px',
                            slidesToShow: 1,
                            dots: true,
                            arrows: true,
                            prevArrow: '<b><i class="fa-solid fa-angle-left"></i></b>',
                            nextArrow: '<b><i class="fa-solid fa-angle-right"></i></b>'
                        });
                    }
                    function loadSlick(){
                        const script = document.createElement("script");
                        script.onload = initLib;
                        script.src = "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js";
                        document.body.appendChild(script);
                    }
                    if (typeof $ == "undefined") {
                        const script = document.createElement("script");
                        script.onload = loadSlick;
                        script.src = "https://code.jquery.com/jquery-3.7.1.slim.min.js";
                        document.body.appendChild(script);
                    } else {
                        initLib();
                    }
                }
            }
        }
    })
}