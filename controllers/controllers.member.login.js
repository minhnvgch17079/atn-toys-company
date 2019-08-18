let {check, validationResult} = require('express-validator')
let client = require('../pg')
let sess

module.exports.checkMemberLogin = (req, res) => {
    sess = req.session
    if(sess.username) {
        res.redirect('/')
    } else {
        res.render('login')
    }
}

module.exports.loginProcess = (req, res) => {
    sess = req.session
    let q = req.body
    let username = q.username
    let password = q.password
    let checkbox = q.checkbox
    let errors = validationResult(req)
    if (checkbox == 'on') {
        res.cookie('username', username)
        res.cookie('password', password)
    } else {
        res.clearCookie('password')
        res.clearCookie('username')
    }
    if(errors.isEmpty()) {
        sql = "SELECT * FROM customer WHERE username = '"+username+"' and password = '"+password+"'"
        client.query(sql, function(err, result) {
            if(err) {
                console.log(err)
            } else if(result.rows.length == 1) {
                sess.username = result.rows[0].username
                sess.userid = result.rows[0].id
                res.redirect('/')
            } else {
                res.render('login', {
                    result: 'wrong Username Or Password'
                })
            }
        })
    } else {
        res.render('login', {
            err: errors.array()
        })
    }
}