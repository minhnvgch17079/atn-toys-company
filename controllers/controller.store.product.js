//MANAGE PRODUCT INTERFACE FOR STORE

const client = require('../pg')
let sess

module.exports.checkStore = (req, res, next) => {
    sess = req.session
    if(sess.storeid) {
        next()
    } else {
        res.redirect('/')
    }
}

module.exports.showProduct = (req, res) => {
    sess = req.session
    let sql = "SELECT * FROM product WHERE store_id = " + sess.storeid
    client.query(sql, (err, result) => {
        if(err) {
            console.log('err in line 20 controller.store.product.js')
        } else {
            res.render('storeProduct', {
                data: result.rows
            })
        }
    })
}