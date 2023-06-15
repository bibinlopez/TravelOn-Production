const Place = require('../models/place')
const UserPlace = require('../models/userPlace')
const User = require('../models/userModel')
const UserTravelLog = require('../models/userTravelLog')
const { CustomAPIError } = require('../errors/custom-error')


// const addPlace0 = (req, res) => {
//    const array = []
//    // console.log(req.file);
//    console.log(req.files);
//    req.files.forEach((item) => {
//       // console.log(item.filename);
//       array.push(`/user/userPlaceImage/${item.filename}`)
//    });

//    // console.log(array);
//    // const Name = `/sample/${req.file.filename}`
//    const data = {
//       name: req.body.name,
//       place: req.body.place,
//       detail: req.body.detail,
//       address: req.body.address,
//       country: req.body.country,
//       state: req.body.state,
//       district: req.body.district,
//       location: {
//          coordinates: [
//             req.body.longitude,
//             req.body.latitude
//          ]
//       },
//       image: array
//    }
//    const log = new UserPlace(data);
//    log.save()
//       .then((result) => {
//          return res.status(200).json({
//             success: true,
//             data: result
//          })
//       })
//       .catch((err) => {
//          return res.status(422).json({
//             success: false,
//             error: err
//          })
//       })
// }

const addPlace = async (req, res) => {
   const { userId, name } = req.user
   console.log(req.body);
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
      image: array,
      createdBy: userId
   }
   const log = new UserPlace(data);
   const result = await log.save()

   return res.status(201).json({ success: true, msg: 'Place added', result })
}

const getAllPlaces = async (req, res) => {
   const places = await UserPlace.find({})
   if (!places.length) {
      throw new CustomAPIError('No Places found , Please add places to View them', 404)
   }

   return res.status(200).json({ success: true, count: places.length, data: places })
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
      images: array,
      createdBy: req.user.userId
   }
   const log = new UserTravelLog(data);
   const result = await log.save()
   return res.status(201).json({ success: true, msg: 'TravelLog added', result })
}

const getAllTravleLogs = async (req, res) => {
   const logs = await UserTravelLog.find({})
   if (!logs.length) {
      throw new CustomAPIError('No Places found , Please add places to View them', 404)
   }

   return res.status(200).json({ success: true, count: logs.length, data: logs })
}


const newPassword = async (req, res) => {
   const { email, oldPassword, password, confirmPassword } = req.body

   if (!oldPassword || !confirmPassword) {
      throw new CustomAPIError('please provide old password and new Password', 400)
   }


   const user = await User.findOne({ email })
   // console.log(user, 'this is user');
   if (!user) {
      throw new CustomAPIError('invalid credentials(email)', 401)
   }

   const isPasswordCorrect = await user.comparePassword(oldPassword)

   if (!isPasswordCorrect) {
      throw new CustomAPIError('Please provide correct Old Password', 401)
   }

   if (password !== confirmPassword) {
      throw new CustomAPIError('password and confirm password should be same', 400)
   }

   user.password = password

   await user.save()

   return res.status(200).json({ success: true, msg: "Password changed Successfully!!!" })

}


const startUpAPI = async (req, res) => {
   const { lat, long } = req.body
   if (!lat || !long) {
      throw new CustomAPIError('please provide Latitude and Longitude', 400)
   }
   const nearPlaces = await Place.aggregate([
      {
         $geoNear: {
            near: {
               type: "Point",
               coordinates: [  // need to parse float
                  parseFloat(long),
                  parseFloat(lat)
               ]
            },
            maxDistance: 500,  //in meters
            distanceField: "distance in meters",
            spherical: true
         }
      }, { $match: { status: true } }    // only show to the user  condition good place to visit
   ])

   return res.status(200).json({ data: nearPlaces })
   //    if (nearPlaces.length) {
   //       console.log('User visited this place');

   //    } else {
   //       return res.send('no place')
   //    }
}


module.exports = {
   addPlace,
   addTravelLog,
   newPassword,
   startUpAPI,
   getAllPlaces,
   getAllTravleLogs
}