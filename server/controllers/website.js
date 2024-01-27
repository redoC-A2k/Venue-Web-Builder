const dayjs = require('dayjs');
const { firestore } = require('firebase-admin');

const db = firestore()

exports.getWebsiteBySlug = async (req, res) => {
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
}

exports.bookWebsiteBySlug = async (req, res) => {
    console.log("Url hit")
    let query = req.body;
    console.log(query)
    let queriesSnap = await db.collection("queries").doc(req.params.slug).get()
    if (!queriesSnap.exists) {
        return res.status(422).json("Website not published !")
    }
    let todayDate = (dayjs(dayjs().format('YYYY-MM-DD 00:00:00')).unix()*1000).toString()
    let queriesCollection = db.collection('queries/' + req.params.slug + '/queries')
    let todayDoc = (await queriesCollection.doc(todayDate).get())
    if(!todayDoc.exists){
        todayDoc = todayDoc.data()
        todayDoc = {queriesArr:[query]}
    } else {
        todayDoc = todayDoc.data()
        todayDoc.queriesArr.unshift(query)
    }
    // let response = await queriesCollection.doc(todayDate).set(todayDoc)
    // console.log(response)
    res.json({ message: "Form Submitted" })
}