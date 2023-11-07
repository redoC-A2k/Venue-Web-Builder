const express = require('express');
const { firestore } = require('firebase-admin');
const router = express.Router()
const fs = require('fs');
const path = require('path')

var admin = require("firebase-admin");

var serviceAccount = require("../admin.json");
const { getHtmlCss } = require('../utils/editor');

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

let template = ' <!DOCTYPE html> <html lang="en"> <head> <meta charset="utf-8"> style </head> body </html> '
router.get('/render', async (req, res) => {
    const webDb = db.collection("web");
    const docRef = webDb.doc('1234564125');

    const doc = await docRef.get();

    if (!doc.exists) {
        res.status(404).json({ message: "Document not found" });
    } else {
        const data = doc.data();
        let htmlCss = getHtmlCss(JSON.parse(data.editorData))
        console.log(htmlCss)
        fs.writeFile('./main.html', htmlCss[0].html, (error) => { console.log("error is - ", error) });
        // fs.writeFile('./main.css', htmlCss[0].css, (error) => { console.log("error is - ", error) });
        let style = `<style>${htmlCss[0].css}</style>`
        // let body = `${htmlCss[0].html}`
        template = template.replace('style', style)
        template = template.replace('body', htmlCss[0].html)
        fs.writeFile('./index.html', template, (error) => { console.log("error is - ", error) })
        res.send(template);
    }
})


module.exports = { router };

