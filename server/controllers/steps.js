const { firestore } = require('firebase-admin');

const db = firestore()
const { getTemplate } = require('../utils/template');


exports.postStepsData = async (req, res) => {
    req.body.published = false
    let response = await db.collection("setup").doc(req.uid).set(req.body)
    console.log(response)
    let editorData = getTemplate(req.body)
    response = await db.collection("editor").doc(req.uid).set({ editorData })
    res.status(200).json({ message: "submitted the form" })
}

exports.getStepsData = async (req, res) => {
    const steps = (await db.collection("setup").doc(req.uid).get())
    if(!steps.exists){
        return res.status(404).json({ steps: false })
    } else {
        return res.status(201).json({
            steps: true,
            slug: steps.data().slug,
            email: steps.data().email,
            name: steps.data().name,
        })
    }
}

