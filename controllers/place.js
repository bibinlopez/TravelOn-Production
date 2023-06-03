const Place = require('../models/place')
const TravelLog = require('../models/travelLog')
const XLSX = require("xlsx");

const addFromExcel = (req, res) => {

   var file = XLSX.readFile('./tourist.xlsx');
   let data = []
   let placeData = []

   const sheets = file.SheetNames
   for (let i = 0; i < sheets.length; i++) {
      const temp = XLSX.utils.sheet_to_json(
         file.Sheets[sheets[i]])

      temp.forEach((res) => {
         data.push(res)
      })
   }


   if (!(data.length === 0)) {

      for (var x = 0; x < data.length; x++) {

         placeData.push({
            name: data[x].name,
            detail: data[x].detail,
            address: data[x].address,
            country: data[x].country,
            state: data[x].state,
            district: data[x].District,

            location: {
               coordinates: [
                  data[x].longitude,
                  data[x].latitude
               ]
            }
         })
      }

      Place.insertMany(placeData)
         .then((result) => {
            return res.status(200).json({
               success: true,
               data: {
                  result,
                  count: result.length
               }
            })
         })
         .catch((err) => {
            console.log(err);
            return res.status(422).json({
               success: false,
               error: err
            })
         })
   } else {
      return res.status(422).json({
         success: false,
         message: "No data fetched , try again"
      })
   }
}

const editPlace = (req, res) => {
   const array = []
   // console.log(req.file);
   // console.log(req.files);
   req.files.forEach((item) => {
      // console.log(item.filename);
      array.push(`/api/${item.filename}`)
   });

   // console.log(array);
   // const Name = `/sample/${req.file.filename}`
   const data = {
      image: array
   }

   Place.findByIdAndUpdate(req.params.id, data, {
      new: true
   })
      .then((result) => {
         if (result) {
            return res.status(200).json({
               success: true,
               data: result
            })
         } else {
            return res.status(404).json({
               success: false,
               error: "Not a Place in that Id"
            })
         }
      })
      .catch((err) => {
         return res.status(500).json({
            success: false,
            error: err
         })
      })
}


const getAllPlaces = (req, res) => {

   Place.find()
      .then((result) => {
         if (result) {
            return res.status(200).json({
               success: true,
               data: {
                  result,
                  count: result.length
               }
            })
         } else {
            return res.status(200).json({
               success: false,
               error: "Place not found"
            })
         }
      })
      .catch((err) => {
         return res.status(200).json({
            success: false,
            error: err
         })
      })
}



const getNearPlaces = async (req, res) => {
   try {
      // console.log(req.user, 'this is req.user');
      // let { lat, long, km } = req.user
      // lat = lat[0];
      // long = long[0];
      // km = km[0];
      // console.log(typeof km);
      const { lat, long, km } = req.body
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
               maxDistance: km * 1000,  //in meters
               distanceField: "distance in meters",
               spherical: true
            }
         }, { $match: { status: true } }    // only show to the user  condition good place to visit
      ])
      const travelLogs = await TravelLog.find()

      return res.status(200).json({ success: true, data: { nearPlaces, travelLogs } })
   } catch (error) {
      return res.status(500).json({ msg: 'Something went wrog try again later' })
   }



   // .then((result) => {
   //    return res.status(200).json({
   //       success: true,
   //       data: {
   //          result,
   //          count: result.length
   //       }
   //    })
   // })
   // .catch((err) => {
   //    console.log(err);
   //    return res.status(422).json({
   //       success: false,
   //       error: "failed"
   //    })
   // })
}

module.exports = {
   getAllPlaces,
   addFromExcel,
   getNearPlaces,
   editPlace
}