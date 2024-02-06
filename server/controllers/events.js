const dayjs = require('dayjs')
const { firestore } = require('firebase-admin')
const db = firestore()

let isBetween = require('dayjs/plugin/isBetween')
dayjs.extend(isBetween)
let isSameOrAfter = require('dayjs/plugin/isSameOrAfter')
dayjs.extend(isSameOrAfter)

exports.getCalendarEvents = async (req, res) => {
    if (Object.keys(req.query).length > 0) {
        const { slug } = req.params
        let start = dayjs(req.query.start.split('T')[0] + " 00:00").subtract(1, 'day')
        let end = dayjs(req.query.end.split('T')[0] + " 00:00").add(1, 'day')
        let events = (await db.collection("events/" + slug + "/events")
            .where('start', '>=', start.unix() * 1000)
            .orderBy('start')
            .get())
            .docs
            .map((event) => event.data())
            .filter((event) => end.isSameOrAfter(event.end, 'second'))
        return res.status(200).json(events)
        // db.collection('')
    } else {
        const setup = (await db.collection("setup").doc(req.uid).get()).data()
        try {
            let eventsDoc = await db.collection("events").doc(setup.slug).get()
            if (!eventsDoc.exists)
                return res.status(422).json("Website not published !")

            let today = dayjs().unix() * 1000
            let events = (await db.collection("events/" + setup.slug + "/events")
                .where('start', '>=', today)
                .orderBy('start').get())
                .docs.map(event => event.data())

            res.status(200).json(events)
        } catch (error) {
            console.log(error)
            res.status(500).error("Unable to get events")
        }
    }
}

exports.isEventColliding = async (newEvent, slug) => {
    // TODO: startDate must be after today , endDateTime must be after startDateTime , endDate must be before 1 year from today
    let eventsSnap = await db.collection("events").doc(slug).get()
    if (!eventsSnap.exists) {
        return res.status(422).json("Website not published !")
    }
    let newEventStartDateTime = dayjs(newEvent.startDate + " " + newEvent.startTime)
    let newEventEndDateTime = dayjs(newEvent.endDate + " " + newEvent.endTime)
    let eventsCollection = db.collection('events/' + slug + '/events')
    let [lessEndDocs, moreStartDocs] = await Promise.all([
        eventsCollection.where('start', '<=', newEventEndDateTime.unix() * 1000).get(), // lessEndDocs
        eventsCollection.where('end', '>=', newEventStartDateTime.unix() * 1000).get() // moreStartDocs
    ])
    //           |-----|  |----------|   |--------------|
    // |-------|     |----------|          |---------|
    // 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20
    // event 1 : [1,5]
    // event 2 : [8,12]
    // event 3 : [16,19]
    // case 1 :
    // event 4 : [10,14] -- confliciting
    // start <= event.end -> [1,5],[8,12]    common -> [8,12]
    // end >= event.start -> [8,12],[16,19]  common -> [8,12]
    // case 2 : 
    // event 5 : [15,20] -- conflicting
    // start <= event.end -> [1,5],[8,12],[16,19] common -> [16,19]
    // end >= event.start -> [16,19]              common -> [16,19]
    // case 3 : 
    // event 6 : [6,9] -- confliciting 
    // start <= event.end -> [1,5],[8,12]       common -> [8,12]
    // end >= event.start -> [8,12],[16,19]     common -> [8,12]

    let isConflicting = false
    let freqMap = {}
    for (let event of lessEndDocs.docs)
        freqMap[event.id] = 1;

    for (let event of moreStartDocs.docs)
        if (freqMap[event.id] === 1) {
            isConflicting = true
            break;
        }

    if (isConflicting){
        console.log("Events are colliding")
        return true;
    }
    else return false;
}

exports.postCalendarEvents = async (req, res) => {
    const setup = (await db.collection("setup").doc(req.uid).get()).data()
    try {
        if (req.body.title.toString() == "" || req.body.startTime.toString() == "" || req.body.endTime.toString() == "" || req.body.startDate.toString() == "" || req.body.endDate.toString() == "")
            throw "Invalid request body"
        else {
            let newEvent = {
                title: req.body.title,
                startTime: req.body.startTime,
                endTime: req.body.endTime,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
            }
            let isColliding = await this.isEventColliding(newEvent, setup.slug)
            console.log(isColliding)
            if (isColliding)
                return res.status(409).json("Event is colliding with another event")
            else {
                let newEventStartDateTime = dayjs(newEvent.startDate + " " + newEvent.startTime)
                let newEventEndDateTime = dayjs(newEvent.endDate + " " + newEvent.endTime)
                let response = await db.collection('events/' + setup.slug + '/events').doc().set({
                    title: newEvent.title,
                    start: newEventStartDateTime.unix() * 1000,
                    end: newEventEndDateTime.unix() * 1000
                })
                console.log(response)
            }
            res.status(200).json("Calendar event added")
        }
    } catch (error) {
        console.log(error)
        res.status(400).json("A field is missing or empty")
    }
}