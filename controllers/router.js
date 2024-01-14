const express = require('express');
const { firestore } = require('firebase-admin');
const router = express.Router()

var admin = require("firebase-admin");

var serviceAccount = require("../admin.json");
// const { getHtmlCss } = require('../utils/editor.mjs');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = firestore()

router.post("/venue/owner/web", async (req, res) => {
    console.log("request for storing")
    const { authorization } = req.headers
    if (!authorization) {
        return res.status(401).json({ error: "You are not authorised !" })
    }
    let decodedToken = await admin.auth().verifyIdToken(authorization)
    const editorDb = db.collection("editor");
    const data = JSON.stringify(req.body)
    const response = await editorDb.doc(decodedToken.uid).set({ editorData: data });
    console.log(response)
    res.json({ message: "request received" })
})

router.get("/venue/owner/web", async (req, res) => {
    const { authorization } = req.headers
    if (!authorization) {
        return res.status(401).json({ error: "You are not authorised !" })
    }
    let decodedToken = await admin.auth().verifyIdToken(authorization)
    
    const editorDb = db.collection("editor");
    const docRef = editorDb.doc(decodedToken.uid);

    const doc = await docRef.get();

    if (!doc.exists) {
        res.status(404).json({ message: "Document not found" });
    } else {
        const data = doc.data();
        res.send(data.editorData)
        // res.json(JSON.parse(data.editorData));
    }
});


// let part1 = `<!DOCTYPE html>
// <html>
// <head>
// <script src="https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js"></script>
// <script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.9/index.global.min.js"></script>
// <script>
// document.addEventListener( 'DOMContentLoaded', function() {
//     // for splide carousel
//     var elms = document.getElementsByClassName( 'splide' );
//     for ( var i = 0; i < elms.length; i++ ) {
//         new Splide( elms[ i ], {
//             padding: {
//                 left: "15%",
//                 right: "15%",
//             },
//             gap: "1em",
//         }).mount();
//     }
//     let cal = document.querySelector ('div.fcCalendar')
//     new FullCalendar.Calendar(cal, {
//         initialView: 'dayGridMonth'
//     }).render();
//     // for fullcalendar

// });
// </script>
// <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/css/splide.min.css">
// <title>Grapesjs page</title>`
// let part2 = `</head>`
// let part3 = `</html>`
// router.get('/venue/render', async (req, res) => {
//     const webDb = db.collection("web");
//     const docRef = webDb.doc('1234564125');

//     const doc = await docRef.get();

//     if (!doc.exists) {
//         res.status(404).json({ message: "Document not found" });
//     } else {
//         const data = doc.data();
//         Promise.all([
//             import('../utils/editor.mjs')
//         ]).then((arg) => {
//             let getHtmlCss = arg[0].default
//             let htmlCss = getHtmlCss(JSON.parse(data.editorData))
//             let template = part1 + `<style>${htmlCss[0].css}</style>` + part2 + htmlCss[0].html + part3
//             console.log("Got template")
//             res.send(template);
//         })
//     }
// })


router.post('/venue/publish', async (req, res) => {
    // get firebase jwt token from req
    const { authorization } = req.headers
    if (!authorization) {
        return res.status(401).json({ error: "You are not authorised !" })
    }
    let decodedToken = await admin.auth().verifyIdToken(authorization)
    // store data in db
    const setup = (await db.collection("setup").doc(decodedToken.uid).get()).data()
    if (!setup) {
        // TODO: Check all setup is done not just slug
        return res.status(404).json({ error: "Setup not done !"})
    }
    // adding more data in req.body
    req.body.title = setup.name

    await db.collection("website").doc(setup.slug).set(req.body)    
    await db.collection("queries").doc(setup.slug).set({queries:[]})
    return res.json({ message: "Website published !"})
})

router.get('/venue/queries', async (req, res) => {
    const { authorization } = req.headers
    if (!authorization) {
        return res.status(401).json({ error: "You are not authorised !" })
    }
    let decodedToken = await admin.auth().verifyIdToken(authorization)
    const setup = (await db.collection("setup").doc(decodedToken.uid).get()).data()
    let queries = (await db.collection("queries").doc(setup.slug).get()).data().queries;
    console.log(queries)
    res.json({data:queries})
})        

module.exports = { router };

