
const UserPlace = require('../models/userPlace')
const UserTravelLog = require('../models/userTravelLog')

const addPlace0 = (req, res) => {
   const array = []
   // console.log(req.file);
   console.log(req.files);
   req.files.forEach((item) => {
      // console.log(item.filename);
      array.push(`/user/userPlaceImage/${item.filename}`)
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

const addPlace = async (req, res) => {
   const array = [
      "/user/userPlaceImageDefault/photo-168665660393121.jpg",
      "/user/userPlaceImageDefault/photo-168665660393963.jpg",
      "/user/userPlaceImageDefault/photo-168665660394348.jpg"
   ]
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
   const result = await log.save()

   return res.status(201).json({ success: true, msg: 'Place added', result })
}

const addTravelLog = async (req, res) => {
   const array = [
      "/user/userPlaceImageDefault/photo-168665660393121.jpg",
      "/user/userPlaceImageDefault/photo-168665660393963.jpg",
      "/user/userPlaceImageDefault/photo-168665660394348.jpg"
   ]
   const { heading, remark, latitude, longitude, content } = req.body
   const data = {
      heading,
      remark,
      latitude,
      longitude,
      content,
      images: array
   }
   const log = new UserTravelLog(data);
   const result = await log.save()
   return res.status(201).json({ success: true, msg: 'TravelLog added', result })
}

module.exports = {
   addPlace0,
   addPlace,
   addTravelLog
}