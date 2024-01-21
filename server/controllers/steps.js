const { firestore} = require('firebase-admin');

const db = firestore()
const { getTemplate } = require('../utils/template');


exports.postStepsData = async (req, res) => {
    let response = await db.collection("setup").doc(req.uid).set(req.body)
    console.log(response)
    let editorData = getTemplate(req.body)
    response = await db.collection("editor").doc(decodedToken.uid).set({ editorData })
    res.status(200).json({message: "submitted the form"})
}

exports.getStepsData = async (req,res)=>{
    const steps = (await db.collection("setup").doc(req.uid).get()).data()
    if(!steps){
        return res.status(404).json({steps:false})
    } else {
        return res.status(201).json({
            steps:true,
            slug: steps.slug
        })
    }
}

