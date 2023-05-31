
const { CustomAPIError } = require('../errors/custom-error')
const User = require('../models/userModel')

const bcrypt = require('bcrypt');
var validator = require('validator');
var passwordValidator = require('password-validator');

// Create a schema
var schema = new passwordValidator();
// Add properties to it
schema
   .is().min(5)                                    // Minimum length 5
   .is().max(10)                                   // Maximum length 100
   .has().uppercase()                              // Must have uppercase letters
   .has().lowercase()                              // Must have lowercase letters
   .has().digits(1)                                // Must have at least 1 digit     
   .has().symbols()                                // Must have symbols
   .has().not().spaces()                           // Should not have spaces


const userRegistration = async (req, res) => {
   let { name, dob, address, mob, pin, email, bloodGroup, password, confirmPassword } = req.user
   name = name[0].trim();
   email = email[0].trim();
   address = address[0].trim();
   pin = pin[0].trim();
   mob = Number(mob[0].trim())
   dob = dob[0].trim();
   bloodGroup = bloodGroup[0].trim();
   password = password[0].trim();
   confirmPassword = confirmPassword[0].trim();
   // console.log(typeof mob);
   if (name == "" || email == "" || address == "" || pin == "" || mob == "" || bloodGroup == "" || dob == "" || password == "" || confirmPassword == "") {
      throw new CustomAPIError('please providse credentials', 400)

   } else if (!/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/.test(name)) {
      throw new CustomAPIError('invalid name entered', 400)

   } else if (!/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/.test(mob)) {
      throw new CustomAPIError('invalid mob. no entered', 400)

   }else if (/\d{7}/.test(pin)) {
      throw new CustomAPIError('invalid pin-code entered', 400)

   }else if (password !== confirmPassword) {
      throw new CustomAPIError('password must be same', 400)

   } else if (validator.isEmail(email) === false) {
      throw new CustomAPIError('invalid email entered', 400)

   } else if (schema.validate(password) === false) {
      throw new CustomAPIError('invalid password entered', 400)
   }

   const user = await User.findOne({ email })
   if (user) {
      throw new CustomAPIError('User with the provided email address already exists', 400)
   }

   saltRounds = 10
   const hashedPassword = await bcrypt.hash(password, saltRounds)
   const data = {
      name,
      email,
      address,
      dob,
      mob,
      bloodGroup,
      pin,
      password: hashedPassword,
   }
   const newUser = new User(data);
   const result = await newUser.save()
   return res.status(201).json({ success: true, data: result })

}


module.exports = {
   userRegistration
}