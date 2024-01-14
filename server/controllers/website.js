const express = require('express');
const { firestore } = require('firebase-admin');
const websiteRouter = express.Router()

const db = firestore()

websiteRouter.get("/website/:slug", async (req, res) => {
    console.log("Url hit")
    const { slug } = req.params
    const docRef = db.collection("website").doc(slug);
    const doc = await docRef.get();
    if (!doc.exists) {
        res.status(404).json({ message: "Document not found" });
    } else {
        const data = doc.data();
        let webpage = `<!DOCTYPE html>
<html>
<head>
<title>${data.title}</title>
<style>
${data.css}
</style>
<script src="https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/css/splide.min.css">
</head>
<body>
${data.html}
</body>
</html>
`
        // console.log(webpage)
        res.send(webpage)
    }
})

websiteRouter.post('/book/:slug',async (req,res)=>{
    console.log("Url hit")
    let query = req.body;
    let objKeys = Object.keys(query)
    let objValues = Object.values(query)
    let queriesSnap = await db.collection("queries").doc(req.params.slug).get();
    if(!queriesSnap.exists){
        return res.status(200).json({message:"You have not published website till now"})
    }
    let queries = queriesSnap.data().queries
    queries = [req.body,...queries]
    await db.collection("queries").doc(req.params.slug).set({queries})
    res.json({message:"Form Submitted"})
})
module.exports = { websiteRouter }