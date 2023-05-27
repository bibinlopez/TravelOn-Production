
const mongoose = require('mongoose')
const PlaceSchema = new mongoose.Schema({
   name: {
      type: String,
      required: false,
      trim: true,
   },
   detail: {
      type: String, required: false
   },
   address: {
      type: String, required: false
   },
   country: {
      type: String, required: false
   },
   state: {
      type: String, required: false
   },
   district: {
      type: String, required: false
   },
   image: {
      type: [String], required: false
   },
   location: {
      type: {
         type: String,
         enum: ["Point"],
         default: "Point"
      },
      coordinates: {
         type: [Number],
         required: [false, 'please enter store coordinates']
      }
   },
   status: {
      type: Boolean,
      default: true
   },
   totalRating: {
      type: Number,
      default: 4.5,
   },
   createdAt: {
      type: Date,
      required: false
   }
})


PlaceSchema.pre('save', function (next) {
   if (!this.createdAt) {
      this.createdAt = Date.now() + 19800000
   }
   next()
})

// PlaceSchema.index({ name: "text", district: "text" })
PlaceSchema.index({ location: "2dsphere" })

module.exports = mongoose.model("Place", PlaceSchema)