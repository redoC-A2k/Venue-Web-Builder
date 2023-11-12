const express = require('express');
const { firestore } = require('firebase-admin');
// const gjs_
const router = express.Router()

var admin = require("firebase-admin");

var serviceAccount = require("../admin.json");
// const { getHtmlCss } = require('../utils/editor.mjs');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = firestore()

router.post("/venue/owner/web", async (req, res) => {
    const webDb = db.collection("web");
    const data = JSON.stringify(req.body)
    const response = await webDb.doc('1234564125').set({ editorData: data });
    console.log(response)
    res.json({ message: "request received" })
})

router.get("/venue/owner/web", async (req, res) => {
    const webDb = db.collection("web");
    const docRef = webDb.doc('1234564125');

    const doc = await docRef.get();

    if (!doc.exists) {
        res.status(404).json({ message: "Document not found" });
    } else {
        const data = doc.data();
        res.json(JSON.parse(data.editorData));
    }
});


let part1 = `<!DOCTYPE html>
<html>
<head>
<title>Grapesjs page</title>`
let part2 = `</head>`
let part3 = `</html>`
router.get('/venue/render', async (req, res) => {
    const webDb = db.collection("web");
    const docRef = webDb.doc('1234564125');

    const doc = await docRef.get();

    if (!doc.exists) {
        res.status(404).json({ message: "Document not found" });
    } else {
        const data = doc.data();
        Promise.all([
            import('../utils/editor.mjs')
        ]).then((arg) => {
            let getHtmlCss = arg[0].default
            let htmlCss = getHtmlCss(JSON.parse(data.editorData))
            let template = part1 + `<style>${htmlCss[0].css}</style>` + part2 + htmlCss[0].html + part3
            console.log("Got template")
            res.send(template);
        })
    }
})


module.exports = { router };

