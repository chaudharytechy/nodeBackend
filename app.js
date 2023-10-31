const express=require('express')
const mongoose = require('mongoose');
const connectDB=require('./db/connect_db')
const router=require("./routes/web")
const Port=process.env.PORT||3500;
const app=express();
require('dotenv').config()
const cors=require('cors')
// const connectDb=require("./db/connect_db")
const bodyParser = require('body-parser')
const fileUpload=require('express-fileupload')
var cloudinary=require('cloudinary').v2;
const compression = require('compression');

app.use(compression())


// set template
// app.set('view engine', 'ejs')
// app.use(express.static('public'))

// cors
app.use(cors())

// cloudinary config
cloudinary.config({
    cloud_name:  process.env.ClOUDINARY_NAME  ,
    //  'dm5yrsqdc',
    api_key:process.env.ClOUDINARY_API_KEY,
    // '696133393222185',
    api_secret:process.env.ClOUDINARY_API_SECRET,
    // 'nUn6R9b9CA2Bg44sNTWtfRhvVFQ',
    secure:true
})



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(fileUpload({useTempFiles:true}))

// database connection 
connectDB()


// app.get('/',(req,res)=>{
//     res.send("hello")
// })

// cookie
const cookieParser=require('cookie-parser')
app.use(cookieParser())

// Router Link
app.use('/',router)

app.listen(Port,()=>{
    console.log(`App Listen On the ${Port}`)
})