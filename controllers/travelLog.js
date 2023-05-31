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


module.exports = {
   addTravelLog
}