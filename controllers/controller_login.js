const {check, validationResult} = require('express-validator')
const client = require('../pg')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports.customer_login = (req, res) => {
    res.render('customer_login')
}
module.exports.process_customer_login = [
    check('username').not().isEmpty().withMessage('Please input your username')
        .isLength({max: 25}).withMessage('Max length of username is 25 characters').escape(),
    check('password').not().isEmpty().withMessage('Please input your password')
        .isLength({max: 25}).withMessage('Max length of password is 25 characters').escape(),
    (req, res) => {
        let {username, password} = req.body
        let errors = validationResult(req)
        if(errors.isEmpty()) {
            let sql = "select * from customers where username = '"+username+"'"
            client.query(sql)
            .then(result => {
                if(result.rows.length == 0) {
                    res.render('customer_login', {
                        result: 'Wrong username or password'
                    })
                } else {
                    bcrypt.compare(password, result.rows[0].password)
                    .then(checkMatch => {
                        if(checkMatch == true) {
                            let token = jwt.sign({id: result.rows[0].id}, 'customertramdien')
                            res.cookie('token', token)
                            res.redirect('/')
                        } else {
                            res.render('customer_login', {
                                result: 'Wrong username or password'
                            })
                        }
                    })
                    .catch(error => {
                        res.render('customer_login', {
                            result: 'Wrong username or password'
                        })
                    })
                }
            })
            .catch(error => {
                res.render('customer_login', {
                    result: 'Wrong username or passsword'
                })
            })
        } else {
            res.render('customer_login', {
                errors: errors.array()
            })
        }
    }
]
module.exports.store_login = (req, res) => {
    res.render('store_login')
}
module.exports.process_store_login = [
    check('username').not().isEmpty().withMessage('Please input your username')
        .isLength({max: 25}).withMessage('Max length of username is 25 characters').escape(),
    check('password').not().isEmpty().withMessage('Please input your password')
        .isLength({max: 25}).withMessage('Max length of password is 25 characters').escape(),
    (req, res) => {
        let {username, password} = req.body
        let errors = validationResult(req)
        if(errors.isEmpty()) {
            let sql = "select * from stores where username = '"+username+"'"
            client.query(sql)
            .then(result => {
                if(result.rows.length == 0) {
                    res.render('customer_login', {
                        result: 'Wrong username or password'
                    })
                } else {
                    bcrypt.compare(password, result.rows[0].password)
                    .then(checkMatch => {
                        if(checkMatch == true) {
                            let token = jwt.sign({id: result.rows[0].id}, 'storetramdien')
                            res.cookie('token', token)
                            res.redirect('/store')
                        } else {
                            res.render('store_login', {
                                result: 'Wrong username or password'
                            })
                        }
                    })
                    .catch(error => {
                        res.render('store_login', {
                            result: 'Wrong username or password'
                        })
                    })
                }
            })
            .catch(error => {
                res.render('store_login', {
                    result: 'Wrong username or passsword'
                })
            })
        } else {
            res.render('store_login', {
                errors: errors.array()
            })
        }
    }
]
module.exports.admin_login = (req, res) => {
    res.render('admin_login')
}
module.exports.process_admin_login = [
    check('username').not().isEmpty().withMessage('Please input your username')
        .isLength({max: 25}).withMessage('Max length of username is 25 characters').escape(),
    check('password').not().isEmpty().withMessage('Please input your password')
        .isLength({max: 25}).withMessage('Max length of password is 25 characters').escape(),
    (req, res) => {
        let {username, password} = req.body
        let errors = validationResult(req)
        if(errors.isEmpty()) {
            let sql = "select * from admins where username = '"+username+"'"
            client.query(sql)
            .then(result => {
                if(result.rows.length == 0) {
                    res.render('admin_login', {
                        result: 'Wrong username or password'
                    })
                } else {
                    bcrypt.compare(password, result.rows[0].password)
                    .then(checkMatch => {
                        if(checkMatch == true) {
                            let token = jwt.sign({id: result.rows[0].id}, 'admintramdien')
                            res.cookie('token', token)
                            res.redirect('/admin')
                        } else {
                            res.render('admin_login', {
                                result: 'Wrong username or password'
                            })
                        }
                    })
                    .catch(error => {
                        res.render('admin_login', {
                            result: 'Wrong username or password'
                        })
                    })
                }
            })
            .catch(error => {
                res.render('admin_login', {
                    result: 'Wrong username or passsword'
                })
            })
        } else {
            res.render('admin_login', {
                errors: errors.array()
            })
        }
    }
]
