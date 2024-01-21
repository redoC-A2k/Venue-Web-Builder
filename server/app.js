const express = require("express");
const app = express();
const dotenv = require('dotenv');
const router  = require('./router.js')
const bodyParser = require('body-parser');
dotenv.config()

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.CLIENT_URL);
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, authorization, Accept, Authorization");
  next();
});
// app.use(express.json())
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router)
app.listen(process.env.PORT, () => {
  console.log("server is running on " + process.env.PORT)
})