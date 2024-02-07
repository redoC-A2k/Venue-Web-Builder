module.exports = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization
        console.log(authorization);
    } catch (error) {
        console.log("error occured while validating cron job"+error)
    }
}