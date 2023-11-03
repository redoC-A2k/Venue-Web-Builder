const express = require('express');
const { firestore } = require('firebase-admin');
const router = express.Router()

var admin = require("firebase-admin");

var serviceAccount = require("../admin.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = firestore()

router.post("/venue/owner/web", async (req, res) => {
    console.log(req.body);
    const webDb = db.collection("web");
    //    const snapshot = await webDb.get();
    //snapshot.forEach(doc => {
    //  console.log(doc.id, '=>', JSON.stringify(doc.data()));
    //});
    const data = req.body
    const response = await webDb.doc('1234564125').set(data);
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
        res.json(data);
    }
});

module.exports = { router };

