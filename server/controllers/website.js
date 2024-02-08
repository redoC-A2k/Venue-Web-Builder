const dayjs = require('dayjs');
const { firestore } = require('firebase-admin');
const handlebars = require('handlebars')
const db = firestore()
const fs = require('fs')
const path = require('path')
const newQueryTemplate = handlebars.compile(fs.readFileSync(path.join(__dirname, "/../utils/templates/newQuery.handlebars"), "utf-8"))
const { sendMail } = require('../utils/sendMail')
const { isEventColliding } = require('./events');

exports.getWebsiteBySlug = async (req, res) => {
    console.log("Url hit")
    const { slug } = req.params
    const docRef = db.collection("website").doc(slug);
    const doc = await docRef.get();
    if (!doc.exists) {
        res.status(404).json("Website not published");
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
<script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.9/index.global.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/css/splide.min.css">
<link rel="stylesheet" href="${process.env.CLIENT_URL}/canvas.css">
</head>
<body>
${data.html}
</body>
</html>
`
        res.send(webpage)
    }
}

exports.getWebsiteOrder = async (req, res) => {
    const { slug, orderId } = req.params
    const [slugWeb, order] = await Promise.all([
        db.collection('website').doc(slug).get(),
        db.collection('website/' + slug + '/orders').doc(orderId).get()
    ])
    if (!slugWeb.exists)
        return res.status(422).json("Website not published !")
    if (order.data().status != "created")
        return res.status(424).json("Order already processed !")
    let newEvent = {
        title: order.data().title,
        startTime: order.data().startTime,
        endTime: order.data().endTime,
        startDate: order.data().startDate,
        endDate: order.data().endDate,
    }
    let isColliding = await isEventColliding(newEvent, slug)
    let webpage;
    if (isColliding)
        webpage = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Unfortunately , slot has been booked</title>
</head>
<body>
    <h1>Hi ${order.data().customerEmail}</h1>
    <h2>Unfortunately slots requested by you for ${slug} has been booked !</h2>
    <br/>
    <h4>That is ${slug} is booked from ${newEvent.startDate} , ${newEvent.startTime} to ${newEvent.endDate} , ${newEvent.endTime}
</body>
</html>`

    else
        webpage = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Complete Payment for ${slug}</title>
<script src="https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js"></script>
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
<style>
* {
    margin: 0px;
    padding: 0px;
}

    /* selecting root div of react see - public/index.html */
#root {
    min-height: 99vh;
    position: relative;
}

:root {
    --primary-green: 105, 240, 174;
    --primary-light-green: 153, 230, 0;
    /* --primary-very-light-green: 178, 251, 220; */
    --primary-very-light-green: 160, 248, 202;
    --primary-green-yellow: 118, 255, 3;
    /* --primary-blue: 24, 144, 255;  */
    /* --primary-dark-blue: 36, 48, 83; */
    /* --secondry-blue: 49, 112, 126; */
    /* --secondry-dark-blue:17, 45, 50;  */
    --primary-green: 58, 175, 3;
    /* --primary-dark:104, 118, 132; */
    --primary-white: 250, 250, 250;
    --primary-grey: 240, 240, 240;
    --primary-yellow: 255, 233, 0;
    --primary-green-yellow: 154, 205, 50;
    --primary-orange: 222, 102, 0;
    --primary-red: 255, 74, 74;
    --primary-grey-1: 108, 117, 125;
    --primary-grey-2: 33, 37, 41;
    --primary-grey-3: 50, 54, 58;
    --secondry-grey-1: 238, 238, 238;
    --secondry-grey-2: 221, 221, 221;

    --space-from-top: 85px;

    /* fullcalendar override */
    --fc-border-color: rgba(var(--primary-grey-1), 0.9);
    --fc-neutral-bg-color: rgba(08, 08, 08, 0);
    /* --fc-neutral-text-color: #808080; */
    --fc-neutral-text-color: #000;
    /* --fc-today-bg-color: rgba(255, 220, 40, 0.15); */
    --fc-today-bg-color: rgba(var(--primary-light-green), 0.4);
}
    
    /* General */
html {
    font-size: 62.5%;
}

body {
    font-size: 1.6rem;
}  
button {
    display: inline-block;
    outline: 0;
    cursor: pointer;
    border-radius: 8px;
    box-shadow: 0 2px 5px 0 rgb(213 217 217 / 50%);
    background: #FFF;
    border: 1px solid #D5D9D9;
    font-size: 1.8rem;
    height: auto;
    padding: 1rem 2rem;
    width: auto;
    text-align: center;
    font-weight: 400;
    color: #0F1111;
}

button:hover {
    background-color: #F7FAFA;
    border-color: #D5D9D9;
}

button.cta {
    background-color: rgb(var(--primary-green-yellow));
    color: white;
    border: none;
    font-size: 1.8rem;
    padding: 1rem 2rem;
    text-transform: uppercase;
    font-weight: 700;
    letter-spacing: 1px;
    transition: all 0.3s ease-in-out;
    box-shadow: 0 25.6px 57.6px 0 rgb(0 0 0 / 22%), 0 4.8px 14.4px 0 rgb(0 0 0 / 18%);
    }

    button.cta:hover {
    box-shadow: 0 2px 5px 0 rgb(213 217 217 / 50%);
}

/* my styling */
body {
    padding: 1rem 2rem;
}
</style>
<script>
function pay(){
    let options = {
        key:'${process.env.RAZORPAY_KEY_ID}',
        name:'${slug}',
        order_id:'${order.id}',
        callback_url:'${process.env.HOST}/website/${slug}/order/${order.id}/complete',
    }
    console.log(options)
    let rzp1 = new Razorpay(options);
    rzp1.open();
}
</script>
</head>
<body>
    <h1>Hi ${order.data().customerEmail}</h1>
    <h2>Complete your payment for booking ${slug} by clicking below</h2>
    <br>
    <button id="rzp-button1" class="cta" onclick="pay()" >Pay ${order.data().amount} ₹</button>
</body>
</html>`

    res.send(webpage);
}

exports.postCompletePayment = async (req, res) => {
    try {
        const { slug, orderId } = req.params
        const [slugWeb, order] = await Promise.all([
            db.collection('website').doc(slug).get(),
            db.collection('website/' + slug + '/orders').doc(orderId).get()
        ])
        if (!slugWeb.exists)
            return res.status(422).json("Website not published !")
        if (order.data().status != "created")
            return res.status(424).json("Order already processed !")

        let sha256hmac = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(order.id + "|" + req.body.razorpay_payment_id)
            .digest('hex');
        if (sha256hmac === req.body.razorpay_signature) {
            let newEvent = {
                title: order.data().title,
                startTime: order.data().startTime,
                endTime: order.data().endTime,
                startDate: order.data().startDate,
                endDate: order.data().endDate,
            }
            let newEventStartDateTime = dayjs(newEvent.startDate + " " + newEvent.startTime)
            let newEventEndDateTime = dayjs(newEvent.endDate + " " + newEvent.endTime)
            await Promise.all([
                db.collection('website/' + slug + '/orders').doc(orderId).update({
                    status: "paid"
                }),
                db.collection('events/' + slug + '/events').doc().set({
                    title: newEvent.title,
                    start: newEventStartDateTime.unix() * 1000,
                    end: newEventEndDateTime.unix() * 1000
                })
            ])
        }
        let webpage = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Payment Completed for ${slug}</title>
    <style>
    </style>
</head>
<body>
    <h1>Payment Completed</h1>
    <h2>Thank you for selecting us for your event</h2>
    <hr/>
    <h5>Kindly note Order Id : <span style="color:blue">${orderId}</span> for future reference</h5>
</body>
</html>`
        res.send(webpage)
    } catch (error) {
        console.log("Error while completing payment", error)
        res.status(500).json("Unable to complete payment")
    }
}

exports.bookWebsiteBySlug = async (req, res) => {
    let query = req.body;
    try {

        let todayDate = (dayjs(dayjs().format('YYYY-MM-DD 00:00:00')).unix() * 1000).toString()
        let queriesSubCollection = db.collection('queries/' + req.params.slug + '/queries')
        let queriesCollection = db.collection('queries')
        let [todayDoc, webDoc] = await Promise.all([
            queriesSubCollection.doc(todayDate).get(),
            queriesCollection.doc(req.params.slug).get()
        ])
        if (!webDoc.exists) {
            return res.status(422).json("Website not published !")
        }
        if (!todayDoc.exists) {
            todayDoc = { queriesArr: [query] }
        } else {
            todayDoc = todayDoc.data()
            todayDoc.queriesArr.unshift(query)
        }

        let [response, status] = await Promise.all([
            queriesSubCollection.doc(todayDate).set(todayDoc),
            sendMail(
                "venuewebbuilder@hotmail.com",
                webDoc.data().venueOwnerMail,
                `New Query from ${query['What is your email id ?']}`,
                newQueryTemplate(),
            )
        ])
        console.log(response, status)
        res.json({ message: "Form Submitted" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Unable to submit form" })
    }
}
