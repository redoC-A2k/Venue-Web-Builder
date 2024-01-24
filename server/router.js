const express = require("express");
const router = express.Router();
const firebaseAdminConfig = require("./utils/firebaseAdminConfig.js")
var admin = require("firebase-admin");
admin.initializeApp({
    credential: admin.credential.cert(firebaseAdminConfig)
});

const validateSession = require("./utils/validateSession.js");
let setup = require('./controllers/steps.js')
let editor = require('./controllers/editor.js')
let website = require('./controllers/website.js')
let queries = require('./controllers/queries.js');
let events = require('./controllers/events.js')
const validateCron = require("./utils/validateCron.js");

// const { getHtmlCss } = require('../utils/editor.mjs');


// TODO: Handle and return error to client in each of the following functions

// ------------------- SETUP -------------------
router.post("/venue/web/steps", validateSession, setup.postStepsData, err => {
    console.log("Error in setup.postSetupData : ", err)
});

router.get("/venue/web/steps", validateSession, setup.getStepsData, err => {
    console.log("Error in setup.getSetupData : ", err)
})

// ------------------- EDITOR ------------------- 
router.post("/venue/owner/web", validateSession, editor.postEditorData, err => {
    console.log("Error in editor.postEditorData : ", err);
});
router.get("/venue/owner/web", validateSession, editor.getEditorData, err => {
    console.log("Error in editor.getEditorData : " + err)
});
router.post('/venue/publish', validateSession, editor.publishWebsite, err => {
    console.log("Error in editor.publishWebsite : " + err)
});

// ------------------- QUERIES -------------------
router.get('/venue/queries', validateSession, queries.getQueriesForVenue, err => {
    console.log("Error in editor.getQueriesForVenue : " + err)
})

// ------------------- WEBSITE -------------------
router.get("/website/:slug", website.getWebsiteBySlug, err => {
    console.log("Error in website.getWebsiteBySlug : " + err)
})
router.post('/book/:slug', website.bookWebsiteBySlug, err => {
    console.log("Error in website.bookWebsiteBySlug : " + err)
})

// ------------------- EVENTS ---------------------
router.post('/venue/events', validateSession, events.getCalendarEvents, err => {
    console.log("Error in events.getCalendarEvents : " + err)
})


// ------------------- CRON JOB -------------------
router.delete(`/cron/secret/${process.env.CRON_JOB_SECRET}/queries`, validateCron, queries.deleteAllOldQueries, err => {
    console.log("Error in queries.deleteAllOldQueries : " + err)
})

// ------------------- 404 -------------------
router.get('*', function (req, res) {
    res.status(404).json("Requested endpoint is not exposed from server")
});
router.post('*', function (req, res) {
    res.status(404).json("Requested endpoint is not exposed from server")
});
router.put('*', function (req, res) {
    res.status(404).json("Requested endpoint is not exposed from server")
});
router.delete('*', function (req, res) {
    res.status(404).json("Requested endpoint is not exposed from server")
});


module.exports = router;