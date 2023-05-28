const multiparty = require('multiparty');

const multipartyMiddleware = (req, res, next) => {
   let form = new multiparty.Form();

   form.parse(req, (err, fields, files) => {
      req.user = fields
      next()
   })
}

module.exports = multipartyMiddleware