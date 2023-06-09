const { CustomAPIError } = require('../errors/custom-error')
const User = require('../models/userModel')
const Place = require('../models/place')
const UserVerification = require('../models/userVerification')
const jwt = require('jsonwebtoken')

const TravelLog = require('../models/travelLog')

const bcrypt = require('bcrypt');
var validator = require('validator');

const nodemailer = require('nodemailer')



const sendOTPEmail = async (req, res) => {
   const { email } = req.body

   const userVerificationRecords = await UserVerification.findOne({ email })
   if (userVerificationRecords) {
      const { createdAt } = userVerificationRecords
      if (Date.now() - createdAt <= 300000) {
         throw new CustomAPIError('Your limit reached , Please try after Some times', 400)
      }
      await UserVerification.deleteMany({ email })
   }


   const user = await User.findOne({ email })
   if (user) {
      throw new CustomAPIError('User with the provided email address already exists', 400)
   }


   const otp = `${Math.floor(1000 + Math.random() * 9000)}`

   const transporter = nodemailer.createTransport({
      service: "hotmail",
      auth: {
         user: process.env.EMAIL,
         pass: process.env.PASSWORD
      }
   })

   const options = {
      from: `Travel-On <${process.env.EMAIL}>`,
      to: email,
      subject: "Verifiy Your Email",
      html: `<p> Your OTP Verification code is <b> ${otp} </b>. Enter the code in the TravelOn app to verify your email address and complete verification process. This code <b>expires in 30 minutes</b>.</p>`

   }
   console.log(otp);
   saltRounds = 10
   const hashedOTP = await bcrypt.hash(otp, saltRounds)
   const userverification = await new UserVerification({
      email,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 1800000      // 30 minutes in milliseconds

   })

   //save otp record
   const Result = await userverification.save();
   console.log(Result);
   transporter.sendMail(options, (err, info) => {
      if (err) {
         console.log(err);
         return;
      } else {
         console.log(info.messageId);
         return res.status(200).json({
            status: "PENDING",
            message: 'Verification otp email send through email',
            data: Result
         })
      }
   })

   // return res.status(200).json({ msg: 'success' })
}



const userRegistration = async (req, res) => {
   let { email, password, otp, confirmPassword } = req.body
   console.log(req.body);
   if (!otp || !password) {
      throw new CustomAPIError('Empty input fields', 400)
   }

   const user = await User.findOne({ email })
   if (user) {
      throw new CustomAPIError('User with the provided email address already exists', 400)
   }


   const verified = await verifyOTP(email, otp)

   if (verified) {
      if (password !== confirmPassword) {
         throw new CustomAPIError('password must be same', 400)
      }

      const user = await User.findOne({ email })
      if (user) {
         throw new CustomAPIError('User with the provided email address already exists', 400)
      }

      const newUser = new User(req.body)
      const result = await newUser.save()

      // const token = result.createJWT()

      return res.status(201).json({ success: true , msg : 'User Created' })
   }

}



const verifyOTP = async (email, otp) => {

   const userVerificationRecords = await UserVerification.findOne({ email })
   console.log('records', userVerificationRecords);
   if (!userVerificationRecords) {
      //no record found
      throw new CustomAPIError("Account record does not exist or has been verified already. Please sign up or log in.", 400)
   }

   //user otp record exists
   const { expiresAt } = userVerificationRecords
   const hashedOTP = userVerificationRecords.otp

   if (expiresAt < Date.now()) {
      // user otp records has expired
      // await UserVerification.deleteOne({ email })
      throw new CustomAPIError("Code has expried . Please request again.", 400)
   }
   const validOTP = await bcrypt.compare(otp, hashedOTP)
   if (!validOTP) {
      //entered otp is wrong
      throw new CustomAPIError("Invalid code passed . Check your inbox.", 401)
   }
   await UserVerification.deleteOne({ email })

   return true

}


const userLogin = async (req, res) => {
   const { email, password, lat, long, km } = req.body
   if (!email || !password) {
      throw new CustomAPIError('Please provide email and password', 400)
   }

   if (!lat || !long || !km) {
      throw new CustomAPIError('Please provide location details', 400)
   }

   const user = await User.findOne({ email }).select('-password')

   if (!user) {
      throw new CustomAPIError('invalid credentials(email)', 401)
   }

   const isPasswordCorrect = await user.comparePassword(password)

   if (!isPasswordCorrect) {
      throw new CustomAPIError('invalid credentials(password)', 401)
   }

   const token = user.createJWT()


   const nearPlaces = await Place.aggregate([
      {
         $geoNear: {
            near: {
               type: "Point",
               coordinates: [  // need to parse float
                  parseFloat(long),
                  parseFloat(lat)
               ]
            },
            maxDistance: km * 1000,  //in meters
            distanceField: "distance in meters",
            spherical: true
         }
      }, { $match: { status: true } }    // only show to the user  condition good place to visit
   ])


   const travelLogs = await TravelLog.find()


   return res.status(200).json({ success: true, data: { user, token, nearPlaces, travelLogs } })

}


module.exports = {
   sendOTPEmail,
   userRegistration,
   userLogin
}