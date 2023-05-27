const express = require('express')
require('dotenv').config()

// extra security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')



const connectDB = require('./db/connect')
const notFound = require('./middlewares/notFound')
const app = express()
const place = require('./routes/place')
const sample = require('./routes/sample')


app.use(rateLimit({
   windowMs: 15 * 60 * 1000, // 15 minutes
   max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
   standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
   legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}))

app.use(express.json())

app.use(helmet())
app.use(cors())
app.use(xss())



app.use('/', express.static('public/homePage'))
// app.get('/', (req,res)=>{
//    res.send('hello bibin, hello travelOn') 
// })



app.use('/api', place)
app.use('/sample', sample)
app.use(notFound)

const port = process.env.PORT || 3000;

const start = async () => {
   try {
      await connectDB(process.env.MONGO_URI)
      await app.listen(port, console.log(`Server is listening on the port ${port}`))
   } catch (error) {
      console.log(error);
   }
}

start();
