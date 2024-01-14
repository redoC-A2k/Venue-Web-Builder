import { Editor } from "grapesjs";
import { carousel, slide } from "./consts";
import { PluginOptions } from ".";

export default (editor:Editor, opts:PluginOptions) => {
    const bm = editor.BlockManager;
    bm.add(carousel.name, {
        label: carousel.label,
        media:`<?xml version="1.0" encoding="UTF-8" standalone="no"?> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><g id="Layer_40" data-name="Layer 40"><path d="M53.73,14H10.27a1.5,1.5,0,0,0-1.5,1.5V48.53a1.5,1.5,0,0,0,1.5,1.5H53.73a1.5,1.5,0,0,0,1.5-1.5V15.47A1.5,1.5,0,0,0,53.73,14ZM52.23,47H11.77V17H52.23Z"/><path d="M60,17.54A1.5,1.5,0,0,0,58.5,19V45a1.5,1.5,0,1,0,3,0V19A1.5,1.5,0,0,0,60,17.54Z"/><path d="M4,17.54A1.5,1.5,0,0,0,2.5,19V45a1.5,1.5,0,0,0,3,0V19A1.5,1.5,0,0,0,4,17.54Z"/></g></svg>`,
        category: 'Carousel',
        content:{type:carousel.type}

    })

    bm.add(slide.name,{
        label:slide.label,
        category:"Carousel",
        media: `<?xml version="1.0" encoding="utf-8"?><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 122.88 97.68" style="enable-background:new 0 0 122.88 97.68" xml:space="preserve"><style type="text/css">.st0{fill-rule:evenodd;clip-rule:evenodd;}</style><g><path class="st0" d="M0,0h122.88v97.68H0V0L0,0z M34.56,25.4c4.41,0,7.99,3.58,7.99,7.99c0,4.42-3.58,7.99-7.99,7.99 c-4.41,0-7.99-3.58-7.99-7.99C26.57,28.97,30.15,25.4,34.56,25.4L34.56,25.4z M68.2,59.7l15.99-27.64l16.99,42.96l-79.27,0v-5.33 l6.66-0.33l6.66-16.32l3.33,11.66h9.99l8.66-22.31L68.2,59.7L68.2,59.7z M9.13,8.09h104.63v81.49H9.13V8.09L9.13,8.09z"/></g></svg>`,
        content:{type:slide.type}
    })
}



 //     content: `
    //     <div
    //     class="splide"
    //     aria-label="Splide Basic HTML Example"
    //   >
    //     <div class="splide__track">
    //       <ul class="splide__list">
    //         <li class="splide__slide">
    //           <img
    //             src="https://source.unsplash.com/random/500x300/?img=1"
    //             alt=""
    //           />
    //         </li>
    //         <li class="splide__slide">
    //           <img
    //             src="https://source.unsplash.com/random/500x300/?img=2"
    //             alt=""
    //           />
    //         </li>
    //         <li class="splide__slide">
    //           <img
    //             src="https://source.unsplash.com/random/500x300/?img=3"
    //             alt=""
    //           />
    //         </li>
    //       </ul>
    //     </div>
    //   </div>
    //     `