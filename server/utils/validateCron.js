module.exports = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization
        let base64str = authorization.replace('Basic ', '')
        let utf8 = Buffer.from(base64str, 'base64').toString('utf8')
        let [username, password] = utf8.split(':')
        if (username == process.env.CRON_JOB_USERNAME && password == process.env.CRON_JOB_PASSWORD) {
            next()
        } else {
            res.status(401).json("Unauthorized")
        }
    } catch (error) {
        console.log("error occured while validating cron job" + error)
    }
}