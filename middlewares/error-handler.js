const { CustomAPIError } = require('../errors/custom-error')

const errorHandlerMiddlerware = (err, req, res, next) => {
   if (err instanceof CustomAPIError) {
      return res.status(err.statusCode).json({ msg: err.message })
   }
   // return res.status(500).json({ msg: 'Something went wrong try again later' })
   return res.status(500).json({ msg: err.message })
}

module.exports = errorHandlerMiddlerware 