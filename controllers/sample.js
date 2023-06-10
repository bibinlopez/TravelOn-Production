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



const path = require('path')

const uploadProductImage = async (req, res) => {
   // console.log(req.files);
   const productImage = req.files.image

   if (productImage.length) {
      const array = []

      for (i in productImage) {
         const imagePath = path.join(__dirname, '../public/uploads/' + `${productImage[i].name}`)
         await productImage[i].mv(imagePath)
         array.push(`/uploads/${productImage[i].name}`)
      }
      console.log(array);

      return res.status(200).json({ success: true, img: { src: array } })
   } else {
      const imagePath = path.join(__dirname, '../public/uploads/' + `${productImage.name}`)

      await productImage.mv(imagePath)

      return res.status(200).json({ success: true, img: { src: `/uploads/${productImage.name}` } })

   }


}




module.exports= {
   addSample,
   uploadProductImage
}