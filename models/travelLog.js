
const mongoose = require('mongoose')
const travelLog = new mongoose.Schema({
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
   createdAt: {
      type: Date,
      required: false
   }
})


travelLog.pre('save', function (next) {
   if (!this.createdAt) {
      this.createdAt = Date.now() + 19800000
   }
   next()
})



module.exports = mongoose.model("TravelLog", travelLog)