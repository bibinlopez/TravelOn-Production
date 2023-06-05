const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, 'must provide name'],
      match: [/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/, 'please provide valid name'],
      minLength: 3,
      maxLength: 20,
      trim: true
   },
   address: {
      type: String,
      required: [true, 'must provide address'],
      minLength: 10 ,
      trim : true
   },
   pin: {
      type: Number,
      required: [true, 'must provide pin'],
      match: [/\d{7}/, 'please provide valid pin']
   },
   mob: {
      type: Number,
      required: [true, 'must provide mob. Number'],
      match: [/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/, 'please provide valid mob. number']
   },
   dob: {
      type: Date,
      required: [true, 'must provide dob']
   },
   bloodGroup: {
      type: String,
      required: [true, 'must provide bloodgroup']
   },
   email: {
      type: String,
      required: [true, 'must provide email'],
      match: [
         /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
         'please provide valid email'],
      trim: true
   },

   password: {
      type: String
   },
   // lockedPlaces: [
   //     {
   //         placeId: { type: mongoose.Schema.Types.ObjectId, ref: "Place" },
   //         isVisited: { type: String, default: false }
   //     }
   // ],
   visitedPlaces: [
      {
         placeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Place"
         }
      }
   ],
   // createdAt: {
   //    type: Date,
   //    required: false
   // }
},
   { timestamps: true }
)


// userSchema.pre('save', function (next) {
//    const date = Date.now()
//    if (!this.createdAt) {
//       this.createdAt = date + 19800000
//    }
//    next()
// })


userSchema.pre('save', async function () {
   const saltRound = 10
   this.password = await bcrypt.hash(this.password, saltRound)
})


userSchema.methods.createJWT = function () {
   return jwt.sign({ userId: this._id, name: this.name }, process.env.JWT, { expiresIn: '30d' })
}

userSchema.methods.comparePassword = async function (password) {
   const isMatch = bcrypt.compare(password, this.password)
   return isMatch
}



module.exports = mongoose.model("User", userSchema)