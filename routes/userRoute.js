

const express = require('express')
const router = express.Router();

const multiparty = require('../middlewares/multiparty')

const {
   userRegistration,
   verifyOTP,
   resendOTP,
   userLogin
 } = require('../controllers/userController')





router.post('/registration', multiparty, userRegistration)
router.post('/verifyotp', verifyOTP)
router.post('/resendotp', resendOTP)
router.post('/login', userLogin)


module.exports = router
