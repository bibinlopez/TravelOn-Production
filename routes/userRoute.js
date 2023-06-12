

const express = require('express')
const router = express.Router();


const multer = require('multer');
const path = require('path')

// const multiparty = require('../middlewares/multiparty')

const {
  userRegistration,
  sendOTPEmail,
  userLogin,
  sendForgotPasswordOTP,
  verifyForgotPasswordOTP,
  setNewPassword
} = require('../controllers/userAuth')

router.post('/registration', userRegistration)
// router.post('/verifyotp', verifyOTP)
// router.post('/resendotp', resendOTP)
router.post('/login', userLogin)
router.post('/otp', sendOTPEmail)

router.post('/otpForgot', sendForgotPasswordOTP)
router.post('/verifyForgotOTP', verifyForgotPasswordOTP)
router.post('/setNewPassword', setNewPassword)

// const { addPlace } = require('../controllers/userCon')


// var storage = multer.diskStorage({
//   destination: './public/userPlaceImage',
//   filename: function (req, file, cb) {
//     let ext = path.extname(file.originalname)
//     // console.log(ext)
//     cb(null, file.fieldname + '-' + Date.now() + Math.floor(10 + Math.random() * 90) + ext)
//   }
// })
// var upload = multer({ storage: storage })


// router.use('/', express.static('public/userPlaceImage'))



// router.post('/', upload.array('photo', 6), addPlace)



module.exports = router
