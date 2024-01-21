var admin = require("firebase-admin");

module.exports = async (req, res, next) => {
    try {
        const { authorization } = req.headers
        if (!authorization) {
            return res.status(401).json({ error: "You are not authorised !" })
        }
        let decodedToken = await admin.auth().verifyIdToken(authorization)
        let loginTime = decodedToken.auth_time * 1000
        let threeDaysBackTime = new Date().getTime() - 1 * 24 * 60 * 60 * 1000
        console.log("loginTime :", loginTime)
        console.log("threeDaysBackTime :", threeDaysBackTime)
        if (loginTime >= threeDaysBackTime) {
            req.uid = decodedToken.uid;
            next()
        } else {
            admin.auth().revokeRefreshTokens(decodedToken.uid)
            let response = await admin.auth().revokeRefreshTokens(decodedToken.uid)
            console.log("revoked refresh tokens :",response)
            return res.status(401).json("Your session has expired !")
        }
    } catch (error) {
        console.log(error)
        res.status(500).json("Unable to authenticate")
    }
}