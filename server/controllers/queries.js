const { firestore } = require('firebase-admin');
const db = firestore()
const dayjs = require('dayjs');
const { sendMail } = require('../utils/sendMail');
const handlebars = require('handlebars')
const crypto = require('crypto')
require('dotenv').config()
const fs = require('fs')
const path = require('path');
const Razorpay = require('razorpay');
const { isEventColliding } = require('./events');

const queryResponseTemplate = handlebars.compile(fs.readFileSync(path.join(__dirname, "/../utils/templates/queryResponse.handlebars"), "utf-8"))

exports.getQueriesForVenue = async (req, res) => {
    const setup = (await db.collection("setup").doc(req.uid).get()).data()
    let queriesSnap = await db.collection("queries").doc(setup.slug).get()
    if (!queriesSnap.exists)
        return res.status(422).json("Website not published !")

    let queriesCollection = db.collection('queries/' + setup.slug + '/queries')
    let queries = (await queriesCollection.orderBy(firestore.FieldPath.documentId(), 'desc').get()).docs
        .map(doc => ({
            docId: dayjs(Number(doc.id)).format('DD-MM-YYYY'),
            queries: doc.data().queriesArr
        }));

    res.json(queries)
}

// TODO: test this , by adding one more document besides punam-mahal
exports.deleteAllOldQueries = async (req, res) => {
    try {
        const allVenues = await db.collection("queries").get();
        let oneYearBackDate = dayjs().subtract(365, 'day');
        let bulkWriter = db.bulkWriter();
        let venuesCollectionPromiseArr = []
        allVenues.forEach(doc => {
            venuesCollectionPromiseArr.push(db.collection('queries/' + doc.id + '/queries').get())
        })
        let venuesCollectionArr = await Promise.all(venuesCollectionPromiseArr)
        venuesCollectionArr.forEach(venue => {
            venue.docs.forEach(doc => {
                // console.log(dayjs(Number(doc.id)).toISOString()," - ",doc.data())
                if (dayjs(Number(doc.id)).unix() < oneYearBackDate.unix()) {
                    bulkWriter.delete(doc.ref)
                }
            })
        })
        let response = await bulkWriter.flush()
        console.log("Bulk writer commit : " + response)
        await bulkWriter.close()
        res.status(200).json("All old queries deleted")
    } catch (error) {
        console.log("Error while deleting all old queries : " + error)
        // res.status(500).json("Unable to delete old queries")
    }
}

exports.postQueryMail = async (req, res) => {
    try {
        const setup = (await db.collection("setup").doc(req.uid).get()).data()
        let newEvent = {
            title: req.body.title,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
        }
        const isColliding = await isEventColliding(newEvent, setup.slug)

        if (isColliding)
            return res.status(409).json("Event is colliding with another event")

        const [order, slugWeb] = await Promise.all([
            initPayment(req.body.token),
            db.collection('website').doc(setup.slug).get()
        ])
        const emailHtml = queryResponseTemplate({
            slug: setup.slug,
            endDate: dayjs(req.body.endDate).format('DD-MM-YYYY'),
            startDate: dayjs(req.body.startDate).format('DD-MM-YYYY'),
            endTime: dayjs("1/1/1 " + req.body.endTime).format('hh:mm A'),
            startTime: dayjs("1/1/1 " + req.body.startTime).format('hh:mm A'),
            title: req.body.title,
            token: req.body.token,
            paymentLink: process.env.HOST + "/website/" + setup.slug + "/order/" + order.id,
            contactUs: setup.email,
            // quote: req.body.quote.replace(/\n/g, "\\n"),
            quote: req.body.quote,
        })
        if (!slugWeb.exists) {
            return res.status(422).json("Website not published !")
        }
        await Promise.all([
            db.collection('website/' + setup.slug + '/orders').doc(order.id).set({
                amount: req.body.token,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                startTime: req.body.startTime,
                endTime: req.body.endTime,
                title: req.body.title,
                customerEmail: req.body.toEmail,
                status: order.status
            }),
            sendMail(
                setup.email,
                req.body.toEmail,
                `Complete your booking for venue ${setup.slug}`,
                emailHtml
            )
        ])
        return res.status(200).json("Mail sent successfully")
    } catch (error) {
        console.log("Error while generating payment link and sending mail :", error)
        return res.status(500).json("Unable to send mail")
    }
}

async function initPayment(amount) {
    let instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    })
    var options = {
        amount: Number(amount) * 100,
        currency: "INR",
    };
    let order = await instance.orders.create(options)
    return order
}