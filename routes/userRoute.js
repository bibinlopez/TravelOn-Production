

const express = require('express')
const router = express.Router();

const multiparty = require('../middlewares/multiparty')

const {
   userRegistration,
   verifyOTP,
   // resendOTP
 } = require('../controllers/userController')





router.post('/registration', multiparty, userRegistration)
router.post('/verifyotp', verifyOTP)
// router.post('/resendotp', resendOTP)


module.exports = router
