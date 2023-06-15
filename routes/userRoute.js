

const express = require('express')
const router = express.Router();

const authMiddlware = require('../middlewares/auth')

const multer = require('multer');
const path = require('path')

// const multiparty = require('../middlewares/multiparty')

const {
  userRegistration,
  sendOTPEmail,
  userLogin,
  sendForgotPasswordOTP,
  verifyForgotPasswordOTP,
  setNewPassword } = require('../controllers/userAuth')

const {
  addPlace0,
  addPlace,
  addTravelLog,
  newPassword,
  startUpAPI,
  getAllPlaces,
  getAllTravleLogs,
  showMe,
  editProfile } = require('../controllers/userCon')


router.post('/registration', userRegistration)
// router.post('/verifyotp', verifyOTP)
// router.post('/resendotp', resendOTP)
router.post('/login', userLogin)
router.post('/otp', sendOTPEmail)

router.post('/otpForgot', sendForgotPasswordOTP)
router.post('/verifyForgotOTP', verifyForgotPasswordOTP)
router.post('/setNewPassword', setNewPassword)




// var storage = multer.diskStorage({
//   destination: './public/User/userPlaceImage',
//   filename: function (req, file, cb) {
//     let ext = path.extname(file.originalname)
//     // console.log(ext)
//     cb(null, file.fieldname + '-' + Date.now() + Math.floor(10 + Math.random() * 90) + ext)
//   }
// })
// var upload = multer({ storage: storage })


router.use('/', express.static('public/User'))



// router.post('/0', upload.array('photo', 6), addPlace0)
router.post('/addplace', authMiddlware, addPlace)
router.post('/addtravelLog', authMiddlware, addTravelLog)
router.post('/newPassword', authMiddlware, newPassword)
router.post('/start', authMiddlware, startUpAPI)
router.get('/getAllPlaces', authMiddlware, getAllPlaces)
router.get('/getAlltravelLogs', authMiddlware, getAllTravleLogs)
router.get('/showMe', authMiddlware, showMe)
router.patch('/editProfile', authMiddlware, editProfile)




module.exports = router
