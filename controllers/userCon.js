
const UserPlace = require('../models/userPlace')

const addPlace = (req, res) => {
   const array = []
   // console.log(req.file);
   console.log(req.files);
   req.files.forEach((item) => {
      // console.log(item.filename);
      array.push(`/user/${item.filename}`)
   });

   // console.log(array);
   // const Name = `/sample/${req.file.filename}`
   const data = {
      name: req.body.name,
      place: req.body.place,
      detail: req.body.detail,
      address: req.body.address,
      country: req.body.country,
      state: req.body.state,
      district: req.body.district,
      location: {
         coordinates: [
            req.body.longitude,
            req.body.latitude
         ]
      },
      image: array
   }
   const log = new UserPlace(data);
   log.save()
      .then((result) => {
         return res.status(200).json({
            success: true,
            data: result
         })
      })
      .catch((err) => {
         return res.status(422).json({
            success: false,
            error: err
         })
      })
}


module.exports = {
   addPlace
}