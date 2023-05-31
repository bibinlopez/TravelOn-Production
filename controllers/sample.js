const Sample = require('../models/sample')

const addSample = (req, res) => {
   const array = []
   // console.log(req.file);
   console.log(req.files);
   req.files.forEach((item)=> {
      // console.log(item.filename);
      array.push(`/sample/${item.filename}`)
   });

   // console.log(array);
   // const Name = `/sample/${req.file.filename}`
   const data = {
      name: req.body.name,
      place: req.body.place,
      image: array
   }
   const log = new Sample(data);
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




module.exports= {
   addSample
}