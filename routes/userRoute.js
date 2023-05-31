

const express = require('express')
const router = express.Router();

const multiparty = require('../middlewares/multiparty')

const {
   userRegistration } = require('../controllers/userController')



   

router.post('/', multiparty, userRegistration)



module.exports = router
