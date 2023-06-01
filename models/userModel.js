
const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, 'must provide name']
   },
   address: {
      type: String,
      required: [true, 'must provide address']
   },
   pin: {
      type: Number,
      required: [true, 'must provide pin']
   },
   mob: {
      type: Number,
      required: [true, 'must provide mob. Number']
   },
   dob: {
      type: String,
      required: [true, 'must provide dob']
   },
   bloodGroup: {
      type: String,
      required: [true, 'must provide bloodgroup']
   },
   email: {
      type: String,
      required: [true, 'must provide email']
   },
   verified: {
      type: Boolean,
      default: false
   },
   password: {
      type: String,
      required: [true, 'must provide password']
   },
   // lockedPlaces: [
   //     {
   //         placeId: { type: mongoose.Schema.Types.ObjectId, ref: "Place" },
   //         isVisited: { type: String, default: false }
   //     }
   // ],
   visitedPlaces: [
      {
         placeId: { type: mongoose.Schema.Types.ObjectId, ref: "Place" }
      }
   ],
   createdAt: {
      type: Date,
      required: false
   }
})


userSchema.pre('save', function (next) {
   const date = Date.now()
   if (!this.createdAt) {
      this.createdAt = date + 19800000
   }
   next()
})




module.exports = mongoose.model("User", userSchema)