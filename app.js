const express=require("express");
const app = express();
const cors =require("cors");
const dotenv =require('dotenv');
const {router}=require('./controllers/router.js')
const bodyParser = require('body-parser');
dotenv.config()

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

console.log("Reached here");

app.set('view engine', 'ejs');
app.use(cors())
// app.use(express.json())
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.json({limit:'50mb',extended:true}));
app.use(router)
app.listen(process.env.PORT,()=>{
    console.log("server is running on "+process.env.PORT)
})