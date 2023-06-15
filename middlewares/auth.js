
const { CustomAPIError } = require('../errors/custom-error')

const jwt = require('jsonwebtoken')

const authMiddlware = async (req, res, next) => {
   const authHeader = req.headers.authorization;

   if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new CustomAPIError('No token found', 401)
   }

   const token = authHeader.split(' ')[1]
   try {
      const decoded = jwt.verify(token, process.env.JWT)
      const { userId, name } = decoded
      req.user = { userId, name }
      next()
   } catch (error) {
      throw new CustomAPIError('Invalid Token', 401)
   }


}

module.exports = authMiddlware