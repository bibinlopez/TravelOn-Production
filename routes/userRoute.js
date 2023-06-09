

const express = require('express')
const router = express.Router();

// const multiparty = require('../middlewares/multiparty')

const {
  userRegistration,
  sendOTPEmail,
  userLogin
} = require('../controllers/userAuth')


const { addPlace } = require('../controllers/userCon')






router.post('/registration', userRegistration)
// router.post('/verifyotp', verifyOTP)
// router.post('/resendotp', resendOTP)
router.post('/login', userLogin)
router.post('/otp', sendOTPEmail)


module.exports = router
