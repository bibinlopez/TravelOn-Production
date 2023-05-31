const express = require('express');
const router = express.Router();
const path = require('path')
const multer = require('multer')
const multiparty = require ('../middlewares/multiparty')

const { addFromExcel,
   getAllPlaces,
   getNearPlaces,
   editPlace
} = require('../controllers/place')


const storage = multer.diskStorage({
   destination: './public/placeImage',
   filename: function (req, file, cb) {
      let ext = path.extname(file.originalname)
      // console.log(ext)
      cb(null, file.fieldname + '-' + Date.now() + ext)
   }
})
var upload = multer({ storage: storage })


router.use('/', express.static('public/placeImage'))



// router.post('/', addFromExcel)
// router.get('/', getAllPlaces)
router.post('/near',multiparty,getNearPlaces)
router.patch('/:id', upload.array('photo', 6) ,editPlace)

module.exports = router 