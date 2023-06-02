
const { CustomAPIError } = require('../errors/custom-error')
const User = require('../models/userModel')
const UserVerification = require('../models/userVerification')
const jwt = require('jsonwebtoken')

const bcrypt = require('bcrypt');
var validator = require('validator');
var passwordValidator = require('password-validator');
const nodemailer = require('nodemailer')

// Create a schema
var schema = new passwordValidator();
// Add properties to it
schema
   .is().min(5)                                    // Minimum length 5
   .is().max(10)                                   // Maximum length 100
   .has().uppercase()                              // Must have uppercase letters
   .has().lowercase()                              // Must have lowercase letters
   .has().digits(1)                                // Must have at least 1 digit     
   .has().symbols()                                // Must have symbols
   .has().not().spaces()                           // Should not have spaces


const userRegistration = async (req, res) => {
   let { name, dob, address, mob, pin, email, bloodGroup, password, confirmPassword } = req.user
   name = name[0].trim();
   email = email[0].trim();
   address = address[0].trim();
   pin = pin[0].trim();
   mob = Number(mob[0].trim())
   dob = dob[0].trim();
   bloodGroup = bloodGroup[0].trim();
   password = password[0].trim();
   confirmPassword = confirmPassword[0].trim();
   // console.log(typeof mob);
   if (name == "" || email == "" || address == "" || pin == "" || mob == "" || bloodGroup == "" || dob == "" || password == "" || confirmPassword == "") {
      throw new CustomAPIError('please providse credentials', 400)

   } else if (!/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/.test(name)) {
      throw new CustomAPIError('invalid name entered', 400)

   } else if (!/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/.test(mob)) {
      throw new CustomAPIError('invalid mob. no entered', 400)

   } else if (/\d{7}/.test(pin)) {
      throw new CustomAPIError('invalid pin-code entered', 400)

   } else if (password !== confirmPassword) {
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

   saltRounds = 10
   const hashedPassword = await bcrypt.hash(password, saltRounds)
   const data = {
      name,
      email,
      address,
      dob,
      mob,
      bloodGroup,
      pin,
      password: hashedPassword,
   }
   const newUser = new User(data);
   const result = await newUser.save()
   // console.log(result);
   sendOTPEmail(result, res)
   // return res.status(201).json({ success: true, data: result })
}



const sendOTPEmail = async (result, res) => {
   const { _id, email } = result
   otp = `${Math.floor(1000 + Math.random() * 9000)}`

   const transporter = nodemailer.createTransport({
      service: "hotmail",
      auth: {
         user: process.env.EMAIL,
         pass: process.env.PASSWORD
      }
   })

   const options = {
      from: `Travel-In <${process.env.EMAIL}>`,
      to: email,
      subject: "Verifiy Your Email",
      html: `<p> Your OTP Verification code is <b> ${otp} </b>. Enter the code in the TravelOn app to verify your email address and complete verification process. This code <b>expires in 30 minutes</b>.</p>`

   }
   saltRounds = 10
   const hashedOTP = await bcrypt.hash(otp, saltRounds)
   const userverification = await new UserVerification({
      userId: _id,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 1800000      // 30 minutes in milliseconds

   })

   //save otp record
   const Result = await userverification.save();
   // console.log(Result);
   transporter.sendMail(options, (err, info) => {
      if (err) {
         console.log(err);
         return;
      } else {
         console.log(info.messageId);
         return res.json({
            status: "PENDING",
            message: 'Verification otp email send through email',
            data: result
         })
      }
   })


}


const verifyOTP = async (req, res) => {

   // console.log('req.body', req.body);
   let { userId, otp } = req.body
   if (!userId || !otp) {
      throw new CustomAPIError('Empty otp details are not allowed', 400)
   } else {
      const userVerificationRecords = await UserVerification.find({ userId })
      console.log('records', userVerificationRecords);
      if (userVerificationRecords.length <= 0) {
         //no record found
         throw new CustomAPIError("Account record does not exist or has been verified already. Please sign up or log in.", 400)
      }
      else {
         //user otp record exists
         const { expiresAt } = userVerificationRecords[0]
         const hashedOTP = userVerificationRecords[0].otp

         if (expiresAt < Date.now()) {
            // user otp records has expired
            await UserVerification.deleteOne({ userId })
            throw new CustomAPIError("Code has expried . Please request again.", 400)
         } else {
            const validOTP = await bcrypt.compare(otp, hashedOTP)
            if (!validOTP) {
               //entered otp is wrong
               throw new CustomAPIError("Invalid code passed . Check your inbox.", 401)
            } else {
               await User.updateOne({ _id: userId }, { verified: true })
               await UserVerification.deleteOne({ userId })
               return res.status(200).json({
                  status: "VERIFIED",
                  message: "User email verified successfully"
               })
            }

         }
      }
   }
}


//for resendOTP and user manually go for email verification
const resendOTP = async (req, res) => {
   // console.log(req.body);
   let { userId } = req.body

   if (!userId) {
      throw new CustomAPIError("Empty user details are not allowed", 400)
   }

   const Result = await User.findOne({ _id: userId })
   // console.log(Result);

   //delete existing records and resend
   await UserVerification.deleteOne({ userId })

   sendOTPEmail(Result, res)
}


const userLogin = async (req, res) => {
   const { email, password } = req.body
   if (!email || !password) {
      throw new CustomAPIError('Please provide email and password', 400)
   }


   const user = await User.findOne({ email })
   
   if (!user) {
      throw new CustomAPIError('invalid credentials(email)', 401)
   }
   const { _id } = user

   const originalPassword = user.password
   const isMatch = await bcrypt.compare(password, originalPassword)
   if (!isMatch) {
      throw new CustomAPIError('invalid credentials(password)', 401)
   }

   const token = jwt.sign({_id, email},process.env.JWT,{expiresIn: '1d'})

   return res.status(200).json({success: true, data: {user, token}})

}


module.exports = {
   userRegistration,
   verifyOTP,
   resendOTP,
   userLogin
}