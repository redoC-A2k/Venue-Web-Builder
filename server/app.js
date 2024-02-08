const express = require("express");
const app = express();
const dotenv = require('dotenv');
const router = require('./router.js')
const bodyParser = require('body-parser');
dotenv.config()

let allowedOrigins = [process.env.CLIENT_URL, 'http://localhost:8080', 'http://localhost:5500']
app.all('*', function (req, res, next) {
  const origin = allowedOrigins.includes(req.headers.origin) ? req.headers.origin : allowedOrigins[0];
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, authorization, Accept, Authorization");
  next();
})

// app.use(express.json())
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router)
app.listen(process.env.PORT, () => {
  console.log("server is running on " + process.env.PORT)
})