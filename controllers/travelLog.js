const TravelLog = require('../models/travelLog')

const addTravelLog = (req, res) => {
   const array = []
   // console.log(req.file);
   console.log(req.files);
   req.files.forEach((item) => {
      // console.log(item.filename);
      array.push(`/travel/${item.filename}`)
   });

   // console.log(array);
   // const Name = `/sample/${req.file.filename}`
   const { heading, remark, latitude, longitude, content } = req.body
   const data = {
      heading,
      remark,
      latitude,
      longitude,
      content,
      images: array
   }
   const log = new TravelLog(data);
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


const getAllTravelLogs = (req, res) => {

   TravelLog.find()
      .then((result) => {
         if (result) {
            return res.status(200).json({
               success: true,
               data: {
                  count: result.length,
                  result
               }
            })
         } else {
            return res.status(404).json({
               success: false,
               error: "travelLog not found"
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

module.exports = {
   addTravelLog,
   getAllTravelLogs
}