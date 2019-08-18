let client = require('../pg')
let {check, validationResult} = require('express-validator')
module.exports.processRegister = (req, res) => {
    var q = req.body
    var username = q.username
    var password = q.password
    var confirm = q.confirm
    var info = q.info
    var errors = validationResult(req)
    if(password !== confirm) {
        res.render('register', {
            result: 'Confirm Password Not Match',
            input: q
        })
    } else if(errors.isEmpty()) {
        var sql = "select * from customer where username='" + username + "'"
        client.query(sql, function(err, r) {
            if(err) {
            } else if (r.rows.length == 1) {
                res.render('register', {
                    result: 'Register faild! UserName Have Exist',
                    input: q
                })
            } else {
                sql = "insert into customer(username, password, info) values "
                sql += "('"+username+"', '"+password+"', '"+info+"')"
                client.query(sql, (err, r) => {
                    if(err) {
                        console.log('err in line 29 controller.member.register')
                    }
                    res.render('register', {
                        result: 'Register Successfully',
                        input: q
                    })
                })
            }
        })
        
    } else {
        res.render('register', {
            err: errors.array(),
            input: q
        })
    }
}