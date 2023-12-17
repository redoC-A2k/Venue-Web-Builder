const express = require('express');
const { firestore, auth } = require('firebase-admin');
const setupRouter = express.Router()

const db = firestore()
var admin = require("firebase-admin");


setupRouter.post("/venue/web/setup", async (req, res) => {
    const { authorization } = req.headers
    if (!authorization) {
        return res.json({ error: "You are not authorised !" })
    }
    let decodedToken = await admin.auth().verifyIdToken(authorization)
    let response = await db.collection("setup").doc(decodedToken.uid).set(req.body)
    console.log(response)
    res.status(200).json({message: "submitted the form"})
})

setupRouter.get("/venue/web/setup", async (req,res)=>{
    const {authorization} = req.headers
    if(!authorization){
        return res.status(401).json({error:"You are not authorised !"})
    }
    let decodedToken = await admin.auth().verifyIdToken(authorization)
    const setup = (await db.collection("setup").doc(decodedToken.uid).get()).data()
    if(!setup){
        return res.status(200).json({setup:false})
    } else {
        return res.status(200).json({setup:true})
    }
})

module.exports={setupRouter}
