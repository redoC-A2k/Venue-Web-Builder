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
    console.log(req.body)
    res.json({message:"Form Submitted"})
})
module.exports = { websiteRouter }