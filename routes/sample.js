const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path')
const { addSample
} = require('../controllers/sample')


var storage = multer.diskStorage({
   destination: './public',
   filename: function (req, file, cb) {
      let ext = path.extname(file.originalname)
      // console.log(ext)
      cb(null, file.fieldname + '-' + Date.now() + ext)
   }
})
var upload = multer({ storage: storage }) 
  

router.use('/', express.static('public'))
   
  

// router.post('/', upload.single('photo'), addSample)
router.post('/', upload.array('photo',6), addSample)




module.exports = router