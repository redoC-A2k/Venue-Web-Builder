const { firestore } = require('firebase-admin');
const nodemailer = require("nodemailer")
const db = firestore()
const dayjs = require('dayjs')


exports.getQueriesForVenue = async (req, res) => {
    const setup = (await db.collection("setup").doc(req.uid).get()).data()
    let queries = (await db.collection("queries").doc(setup.slug).get()).data().queriesmap;
    let allDates = Object.keys(queries);
    allDates.sort((a, b) => {
        let aDate = a.split('-');
        let bDate = b.split('-');
        aDate[0] = parseInt(aDate[0]);
        aDate[1] = parseInt(aDate[1]);
        aDate[2] = parseInt(aDate[2]);
        bDate[0] = parseInt(bDate[0]);
        bDate[1] = parseInt(bDate[1]);
        bDate[2] = parseInt(bDate[2]);
        // Date constructor - year , monthIndex, day (MdN reference)
        return new Date(bDate[2], bDate[1] - 1, bDate[0]) - new Date(aDate[2], aDate[1] - 1, aDate[0])
    })
    let sortedQueries = {}
    for (let i = 0; i < allDates.length; i++) {
        sortedQueries[allDates[i]] = queries[allDates[i]]
    }
    res.json({ queries: sortedQueries })
}

// TODO: test this , by adding one more document besides punam-mahal
exports.deleteAllOldQueries = async (req, res) => {
    try {
        const allDocs = await db.collection("queries").get();
        let date = dayjs().subtract(365, 'day');
        let bulkWriter = db.bulkWriter();
        allDocs.forEach(doc => {
            // console.dir(doc.id+" - ",{depth:null});
            // console.dir(doc.data(),{depth:null});
            let newQueriesMap = {}
            let queriesMap = doc.data().queriesmap;
            let found = false;
            for (let queryDateStr in queriesMap) {
                let queryDateArr = queryDateStr.split('-');
                let queryDate = dayjs(new Date(Number(queryDateArr[2]), Number(queryDateArr[1]) - 1, Number(queryDateArr[0])))
                if (queryDate < date) {
                    console.log(queryDate.date() + "-" + (queryDate.month() + 1) + "-" + queryDate.year())
                    found = true;
                }
                else {
                    newQueriesMap[queryDateStr] = queriesMap[queryDateStr]
                }
            }
            if (found)
                bulkWriter.update(doc.ref, { queriesmap: newQueriesMap });
        })
        let response = await bulkWriter.close()
        console.log("Bulk writer commit : " + response)
        res.status(200).json("All old queries deleted")
    } catch (error) {
        console.log("Error while deleting all old queries : " + error)
        res.status(500).json("Unable to delete old queries")
    }
}

async function sendMail() {
    try {
        let transporter = nodemailer.createTransport({
            host: "smtp-relay.sendinblue.com",
            port: 587,
            auth: {
                user: "afshanahmeda2k@gmail.com",
                pass: process.env.BREVO_KEY
            }
        })

        transporter.sendMail({
            from: "venuewebbuilder@proton.me",
            to: "a2kafshan@gmail.com",
            subject: "New Query",
            html: `
<html>
<body>
<h1>Hello User</h1>
<h3>You have recieved a query , kindly take action to have booking .</h3>
</body>
</html>`
        }).then(messagestatus => {
            // logger.info("message gets delivered", messagestatus)
            // res.json({ message: "Check your mailbox for link" })
            console.log("message delivered")
        })
    } catch (error) {
        console.log("error in sending mail : ", error)
    }
}
// sendMail();