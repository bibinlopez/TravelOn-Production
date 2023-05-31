const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path')
const {
   addTravelLog,
   getAllTravelLogs } = require('../controllers/travelLog')


var storage = multer.diskStorage({
   destination: './public/travelLogImage',
   filename: function (req, file, cb) {
      let ext = path.extname(file.originalname)
      // console.log(ext)
      cb(null, file.fieldname + '-' + Date.now() + Math.floor(10 + Math.random() * 90) + ext)
   }
})
var upload = multer({ storage: storage })


router.use('/', express.static('public/travelLogImage'))



// router.post('/', upload.single('photo'), addSample)
router.post('/', upload.array('photo', 6), addTravelLog)
// router.get('/', getAllTravelLogs)




module.exports = router