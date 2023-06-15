
const mongoose = require('mongoose')
const UserPlaceSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, 'must provide name'],
      minLength: 3,
      maxlegth: 50,
      trim: true,
   },
   detail: {
      type: String,
      required: [true, 'must provide details'],
      maxlegth: 5000,
      trim: true,
   },
   address: {
      type: String,
      required: [true, 'must provide address'],
      maxlegth: 1000,
      trim: true,
   },
   country: {
      type: String,
      required: [true, 'must provide country'],
      maxlegth: 50,
      trim: true,
   },
   state: {
      type: String,
      required: [true, 'must provide state'],
      maxlegth: 50,
      trim: true,
   },
   district: {
      type: String,
      required: [true, 'must provide state'],
      maxlegth: 50,
      trim: true,
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
   createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'please provide User Id']
   }
}, { timestamps: true }
)


// UserPlaceSchema.pre('save', function (next) {
//    if (!this.createdAt) {
//       this.createdAt = Date.now() + 19800000
//    }
//    next()
// })

// PlaceSchema.index({ name: "text", district: "text" })
UserPlaceSchema.index({ location: "2dsphere" })

module.exports = mongoose.model("UserPlace", UserPlaceSchema)