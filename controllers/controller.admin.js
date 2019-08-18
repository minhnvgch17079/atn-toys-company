let {check, validationResult} = require('express-validator')
let client = require('../pg')
let url = require('url')
let sess
module.exports.loginAdmin = (req, res) =>{
    sess = req.session
    let q = req.body
    let username = q.username
    let password = q.password
    let password2 = q.password2
    let errors = validationResult(req)
    if(errors.isEmpty()) {
        let sql = "select * from atnadmin where username = '"+username+"'" 
        sql += " AND password = '"+password+"'"
        sql += " AND password2 = '"+password2+"'"
        client.query(sql, (err, result) => {
            if(err) {
                console.log('err in line 17 controller.admin.js')
            } else if(result.rows.length == 1) {
                sess.admin = 'ADMIN'
                res.redirect('/admin')
            } else {
                res.render('admin', {
                    result: 'Wrong username and password'
                })
            }
        })
    } else {
        res.render('admin', {
            err: errors.array()
        })
    }
}

module.exports.adminUI = (req, res) => {
    let id = req.params.id
    sess = req.session
    if(sess.admin && id == 1) { // SHOW STATISTIC
        res.render('adminui', {
            statistics: 'ok'
        })
    } else if (sess.admin && id == 2) { // SHOW MANAGEMENT STORE ACCOUNT INTERFACE
        let sql = "SELECT * FROM store"
        client.query(sql, (err, result) => {
            if(err) {
                console.log('err in line 45 controller.admin.js')
            } else {
                res.render('adminui', {
                   account: result.rows 
                })
            }
        })
    } else if (sess.admin && id == 3) { // SHOW CONFIRM PRODUCT
        let sql = "SELECT * FROM product WHERE is_show = FALSE"
        client.query(sql, (err, result) => {
            if(err) {
                console.log('err in line 57 controller.admin.js')
            } else {
                res.render('adminui', {
                   product: result.rows 
                })
            }
        })
    } else if (sess.admin && id == 4) { // SHOW CUSTOMER ORDER
        let sql = "SELECT * FROM customer_order WHERE status != 'DONE'"
        client.query(sql, (err, result) => {
            if(err) {
                console.log('err in line 68 at controllers.admin.js')
            } else {
                res.render('myorder', {
                    adminmyorder: result.rows
                })
            }
        })
    } 
}

module.exports.statistics = (req, res) => {
    let id = req.params.id
    sess = req.session
    if(sess.admin && id == 1) {
        let sql = "WITH cte_a AS ("
        sql += " SELECT product.id, product.store_id, COUNT(product.id) * product.price AS price FROM order_detai, product"
        sql += " WHERE order_detai.product_id = product.id AND"
        sql += " order_id IN ("
        sql += " SELECT id FROM customer_order"
        sql += " WHERE order_date >= '"+req.body.from+"'"    
        sql += " AND order_date <= '"+req.body.to+"'"  
        sql += " ) GROUP BY product.id )"
        sql += " SELECT name, SUM(price) FROM store"
        sql += " INNER JOIN cte_a ON store.id = cte_a.store_id GROUP BY name"
        client.query(sql, (err, result) => {
            if(err) {
                res.redirect('/admin/1')
            } else {
                res.render('adminui', {
                    results: result.rows
                })
            }
        })
    }
    
}

module.exports.checkAdminLogin = (req, res) => {
    sess = req.session
    if(sess.admin) {
        res.render('adminui')
    } else {
        res.render('admin')
    }
}

module.exports.confirmProduct = (req, res) => {
    sess = req.session
    let baseURI = url.parse(req.url, true)
    let id = parseInt(baseURI.query.id)
    let show = baseURI.query.show
    if(!sess.admin) {
        res.redirect('/admin')
    } else if (isNaN(id)) {
        res.redirect('/admin/3')
    } else if (show == 'TRUE') {
        let sql = "UPDATE product SET description = 'ACCEPTED BY ADMIN', is_show = " + show + " WHERE id = " + id
        client.query(sql, (err, result) => {
            if(err) {
                res.redirect('/admin/3')
            } else {
                res.redirect('/admin/3')
            }
        })
    } else if (show == 'FALSE') {
        res.render('adminui', {
            refuse: id
        })
    } else {
        res.redirect('/admin/3')
    }
}

module.exports.refuse = (req, res) => { // NEED INPUT VALIDATION 
    sess = req.session
    if(sess.admin) {
        let reason = req.body.reason
        let id = req.body.id
        let sql = "UPDATE product SET description = '"+reason+"' WHERE id = " + id
        client.query(sql, (err, result) => {
            if(err) {
                console.log('err in line 138 controller.admin.js')
            } else {
                res.redirect('/admin/3')
            }
        })
    } else {
        res.redirect('/admin')
    }
}

module.exports.seeDetailOrder = (req, res) => {
    let id = req.params.id
    sess = req.session
    if(sess.admin) {
        let sql = "SELECT id FROM customer_order" 
        sql += " WHERE id = " + id
        client.query(sql, (err, result) => {
            if(err) {
                console.log('err in line 167 at controllers.admin.js')
            } else if (result.rows.length == 1){
                sql = "SELECT name, img, quantity, (price * quantity) AS total"
                sql += " FROM product, order_detai"
                sql += " WHERE product.id = order_detai.product_id"
                sql += " AND order_detai.order_id = " + id
                client.query(sql, (err, result) => {
                    if (err) {
                        console.log('err in line 185 in controller.admin.js')
                    } else {
                        res.render('myorder', {
                            admindetail: result.rows
                        })
                    }
                })               
            } else {
                res.redirect('/admin')
            }
        })
    } else {
        res.redirect('/admin')
    }  
}

module.exports.processCustomerOrder = (req, res) => {
    let id = parseInt(req.query.id)
    let status = req.query.status
    if (isNaN(id)) {
        res.redirect('/admin/4')
    } else if (
        status == 'CONFIRM' ||
        status == 'GOING TO GET THE PRODUCT' ||
        status == 'ORDER IS BEING DELIVERED' ||
        status == 'DONE'
    ) {
        let sql = "UPDATE customer_order SET status = '"+status+"' WHERE id = " + id
        client.query(sql, (err, result) => {
            if(err) {
                console.log('err in line 204')
            } else {
                res.redirect('/admin/4')
            }
        })

    } else {
        res.redirect('/admin/4')
    }
}