const client = require('../pg')
let {check, validationResult} = require('express-validator')

module.exports.list_all_products = (req, res) => {
    let page = parseInt(req.query.page) - 1
    if (isNaN(page)) {
        page = 0
    }
    let sql = "select * from products offset " + page + " rows fetch first 6 rows only"
    client.query(sql)
    .then(result => {
        res.render('customer_ui', {
            products: result.rows
        })
    })
    .catch(err => {
        res.redirect('/')
    })
}
module.exports.customer_order = (req, res) => {
    let productId = parseInt(req.query.productId)
    res.render('customer_ui', {
        order: 'ok',
        errOrder: '',
        productId
    })
}
module.exports.process_customer_order = [
    check('address').not().isEmpty().withMessage('Please input your address').escape(),
    (req, res) => {
        let address = req.body.address
        let productId = parseInt(req.body.productId)
        if(isNaN(productId)) {
            res.redirect('/customer')
            return
        }
        let errors = validationResult(req)
        if(!errors.isEmpty()) {
            res.render('customer_ui', {
                order: 'ok',
                errOrder: 'Please input your address',
                productId
            })
            return
        }
        let sql = "insert into orders(p_id, c_id, info) values "
        sql += "("+productId+", "+req.user.id+",'"+address+"')"
        client.query(sql)
        .then(result => {
            res.redirect('/')
        })
        .catch(err => {
            res.redirect('/')
        })
    }
]