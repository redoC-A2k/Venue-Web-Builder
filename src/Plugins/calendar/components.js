import { calendar } from "./consts";

export default (editor, opts) => {
    const domc = editor.DomComponents;
    domc.addType(calendar.type, {
        isComponent: (el) => {
            if (el.classList && el.classList.contains("fc")) {
                console.log(el.classList)
                return { type: calendar.type };
            }
        },
        model: {
            defaults: {
                type: calendar.type,
                name: calendar.name,
                droppable:false,
                attributes: {
                    "style": "min-width:10%;min-height:30px;",
                    "data-gjs-editable": "false",
                    "class": "fcCalendar",
                },
                script: function () {
                    // console.log(this.id)
                    const el = this;

                    const initLib = function () {
                        let FullCalendar = window.FullCalendar;
                        let calendar = new FullCalendar.Calendar(el, {
                            initialView: 'dayGridMonth'
                        });
                        calendar.render()
                    }
                    if (typeof FullCalendar == "undefined") {
                        const script = document.createElement("script");
                        script.onload = initLib;
                        script.src = "https://cdn.jsdelivr.net/npm/fullcalendar@6.1.9/index.global.min.js";
                        document.body.appendChild(script);
                    } else {
                        initLib();
                    }
                }
            }
        }
    })
}