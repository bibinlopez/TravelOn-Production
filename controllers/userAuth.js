const { CustomAPIError } = require('../errors/custom-error')
const User = require('../models/userModel')
const Place = require('../models/place')
const UserVerification = require('../models/userVerification')
const jwt = require('jsonwebtoken')

const TravelLog = require('../models/travelLog')

const bcrypt = require('bcrypt');
var validator = require('validator');
const nodemailer = require('nodemailer')

const passwordValidator = require('password-validator');

// Create a schema
var schema = new passwordValidator();
// Add properties to it
schema
   .is().min(5)                                    // Minimum length 5
   .is().max(10)                                   // Maximum length 100
   // .has().uppercase()                              // Must have uppercase letters
   .has().lowercase()                              // Must have lowercase letters
   .has().digits(1)                                // Must have at least 1 digit     
   .has().symbols()                                // Must have symbols
   .has().not().spaces()                           // Should not have spaces



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

}



const userRegistration = async (req, res) => {
   let { email, password, name, otp, address, pin, mob, confirmPassword } = req.body
   console.log(req.body);

   name = name.trim()
   email = email.trim();
   address = address.trim();
   pin = Number(pin.trim())
   mob = Number(mob.trim())
   password = password.trim();
   // console.log(typeof mob);
   console.log(address.length);
   if (!otp || !name || !password || !email || !address || !pin || !mob) {
      throw new CustomAPIError('Empty input fields1', 400)
   }

   else if (!/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/.test(name)) {
      throw new CustomAPIError('invalid name entered', 400)

   } else if (!/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/.test(mob)) {
      throw new CustomAPIError('invalid mob. no entered', 400)

   } else if (!/\d{6}/.test(pin)) {
      throw new CustomAPIError('invalid pin-code entered', 400)

   } else if (address.length < 5) {
      throw new CustomAPIError('invalid address', 400)

   }
   else if (password !== confirmPassword) {
      throw new CustomAPIError('password must be same', 400)

   } else if (validator.isEmail(email) === false) {
      throw new CustomAPIError('invalid email entered', 400)

   } else if (schema.validate(password) === false) {
      throw new CustomAPIError('invalid password entered', 400)
   }

   const user = await User.findOne({ email })


   if (user) {
      throw new CustomAPIError('User with the provided email address already exists', 400)
   }


   const verified = await verifyOTP(email, otp)

   if (verified) {

      const newUser = new User(req.body)
      await newUser.save()

      // const token = result.createJWT()

      return res.status(201).json({ success: true, msg: 'User Created' })
   }

}



const verifyOTP = async (email, otp) => {

   const userVerificationRecords = await UserVerification.findOne({ email })
   console.log('records', userVerificationRecords);
   if (!userVerificationRecords) {
      //no record found
      throw new CustomAPIError("Please click 'send OTP button' to this email ID", 400)
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

   console.log(req.body);
   if (!lat || !long || !km) {
      throw new CustomAPIError('Please provide location details', 400)
   }

   const user = await User.findOne({ email })
   console.log(user, 'this is user');
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

   const userProfile = { name: user.name, _id: user._id, address: user.address, pin: user.pin, dob: user.dob, bloodGroup: user.bloodGroup, email: user.email, mob: user.mob }

   return res.status(200).json({ success: true, data: { userProfile, token, nearPlaces, travelLogs } })

}


module.exports = {
   sendOTPEmail,
   userRegistration,
   userLogin
}