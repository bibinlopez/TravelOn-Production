
const mongoose = require('mongoose')
const userTravelLog = new mongoose.Schema({
   heading: {
      type: String,
      required: false,
      trim: true,
   },
   remark: {
      type: String, required: false
   },
   latitude: {
      type: String, required: false
   },
   longitude: {
      type: String, required: false
   },
   content: {
      type: String, required: false
   },
   images: {
      type: [String], required: false
   },
   status: {
      type: Boolean,
      default: true
   },
   Rating: {
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


// userTravelLog.pre('save', function (next) {
//    if (!this.createdAt) {
//       this.createdAt = Date.now() + 19800000
//    }
//    next()
// })



module.exports = mongoose.model("UserTravelLog", userTravelLog)