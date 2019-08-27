const {check, validationResult} = require('express-validator')
const client = require('../pg')
const bcrypt = require('bcrypt')

module.exports.register = (req, res) => {
    res.render('register')
}

module.exports.prosess_register = [
    check('fullname').not().isEmpty().withMessage('Please input your full name')
        .isLength({max: 50}).withMessage('Max length of fullname is 50 characters').escape(),
    check('username').not().isEmpty().withMessage('Please input username')
        .isLength({max: 25}).withMessage('Max length of username is 25').escape(),
    check('password').not().isEmpty().withMessage('Please input your password')
        .isLength({max: 25}).withMessage('Max length of password is 25 characters').escape(),
(req, res) => {
    let {fullname, username, password} = req.body
    let errors  = validationResult(req)
    if (errors.isEmpty()) {
        bcrypt.hash(password, 10)
        .then(hash => {
            let sql = "insert into customers(c_name, username, password) VALUES "
            sql += "('"+fullname+"', '"+username+"', '"+hash+"')"
            client.query(sql)
            .then(result => {
                res.render('register', {
                    result: 'Register Success'
                })
            })
            .catch(error => {
                res.render('register', {
                    result: 'Username have exist'
                })
            })
        })
        .catch(error => {
            res.render('register', {
                result: 'Error in encrpyt password'
            })
        })   
    } else {
        res.render('register', {
            errors: errors.array()
        })
    }
}
]