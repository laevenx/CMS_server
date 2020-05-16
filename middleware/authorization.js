const { Product } = require('../models')

function authorization(req, res, next) {

    Product
        .findByPk(req.params.id)
        .then(data => {

            //console.log(data)
            // return results
            if (data) {
                    //let results = Object.assign(data)
                    //console.log(results)
                    next()

            } else {

                res.status(404).json({
                    msg: 'not found'
                })
            }

        })
    .catch(err => next(err))
}


module.exports = authorization