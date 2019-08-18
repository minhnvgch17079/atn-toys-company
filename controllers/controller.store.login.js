const {check, validationResult} = require('express-validator')
const client = require('../pg')
let sess
module.exports.processLogin = (req, res) => {
    sess = req.session
    let q = req.body
    let username = q.username
    let password = q.password
    let errors = validationResult(req)
    if(errors.isEmpty()) {
        let sql = "SELECT * FROM store WHERE username = '"+username+"' AND "
        sql += "password = '"+password+"'"
        client.query(sql, (err, result) => {
            if(err) {
                console.log('Err Query')
            } else if(result.rows.length == 1) {
                sess.store = result.rows[0].username
                sess.storeid = result.rows[0].id
                res.render('store', {
                    store: sess.store
                })
            } else {
                res.render('storeLogin', {
                    result: 'Wrong username or password'
                })
            }

        })

    }else {
        res.render('storeLogin', {
            err: errors.array()
        })
    }
}

module.exports.checkStore = (req, res) => {
    sess = req.session
    sess.store ? res.render('store', {
        store: sess.store
    }) :
    res.render('storeLogin')
}