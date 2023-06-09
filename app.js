require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()

// extra security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
// const fileUpload = require('express-fileupload')



// const cloudinary = require('cloudinary').v2
// cloudinary.config({
//    cloud_name: process.env.CLOUD_NAME,
//    api_key: process.env.CLOUD_API_KEY,
//    api_secret: process.env.CLOUD_API_SECRET
// })


const connectDB = require('./db/connect')

const notFound = require('./middlewares/notFound')
const errorHandlerMiddlerware = require('./middlewares/error-handler')


const place = require('./routes/place')
const travelLog = require('./routes/travelLog')
const userRoute = require('./routes/userRoute')



app.use(rateLimit({
   windowMs: 15 * 60 * 1000, // 15 minutes
   max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
   standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
   legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}))

app.use(express.json())
// app.use(fileUpload())
// app.use(fileUpload({ useTempFiles: true }))

app.use(helmet())
app.use(cors())
app.use(xss())


app.use(express.static('./public'))
// app.use(express.static('./public/homePage'))
// app.get('/', (req,res)=>{
//    res.send('hello bibin, hello travelOn') 
// })



app.use('/api', place)
// app.use('/sample', sample)
app.use('/travel', travelLog)
app.use('/user', userRoute)


app.use(notFound)
app.use(errorHandlerMiddlerware)


const port = process.env.PORT || 3000;

const start = async () => {
   try {
      await connectDB(process.env.MONGO_URI)
      app.listen(port, console.log(`Server is listening on the port ${port}`))
   } catch (error) {
      console.log(error);
   }
}

start();
