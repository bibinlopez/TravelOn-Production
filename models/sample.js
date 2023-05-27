
const mongoose = require('mongoose')
const sampleSchema = new mongoose.Schema({
   name: {
      type: String,
      required: false,
      trim: true,
   },
   place: {
      type: String, required: false
   },
   image: {
      type: [String], required: false
   },
   createdAt: {
      type: Date,
      required: false
   }
})


sampleSchema.pre('save', function (next) {
   if (!this.createdAt) {
      this.createdAt = Date.now() + 19800000
   }
   next()
})


module.exports = mongoose.model("Sample", sampleSchema)