const { firestore } = require('firebase-admin');
// const { getHtmlCss } = require('../utils/editor.mjs');

const db = firestore()

exports.postEditorData = async (req, res) => {
    const editorDb = db.collection("editor");
    const data = JSON.stringify(req.body)
    const response = await editorDb.doc(req.uid).set({ editorData: data });
    console.log(response)
    res.json({ message: "request received" })
}

exports.getEditorData = async (req, res) => {
    const editorDb = db.collection("editor");
    const docRef = editorDb.doc(req.uid);
    const doc = await docRef.get();

    if (!doc.exists) {
        res.status(404).json({ message: "Document not found" });
    } else {
        const data = doc.data();
        res.send(data.editorData)
        // res.json(JSON.parse(data.editorData));
    }
}


exports.publishWebsite = async (req, res) => {
    // store data in db
    const setup = (await db.collection("setup").doc(req.uid).get()).data()
    if (!setup) {
        // TODO: Check all setup is done not just slug
        return res.status(404).json({ error: "Setup not done !" })
    }
    // adding more data in req.body
    req.body.title = setup.name
    let websiteSnap = await db.collection("website").doc(setup.slug).get()
    if (!websiteSnap.exists) {
        setup.published = true;
        await Promise.all([
            db.collection("website").doc(setup.slug).set(req.body),
            db.collection("queries").doc(setup.slug).set({}),
            db.collection("events").doc(setup.slug).set({}),
            db.collection("setup").doc(req.uid).update(setup)
        ])
    } else {
        await db.collection("website").doc(setup.slug).update(req.body)
    }
    return res.json({ message: "Website published !" })
}