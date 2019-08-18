const express = require('express')
let router = express.Router()
let {check, validationResult} = require('express-validator')
let cookieParser = require('cookie-parser')
router.use(cookieParser())

let memberLogin = require('../controllers/controllers.member.login')

router.get('/', memberLogin.checkMemberLogin)
router.post('/', [
    check('username').not().isEmpty().withMessage('Please Enter Your UserName')
        .isLength({max: 25}).withMessage('Length Of Username Limits By 25 Characters').escape(),
    check('password').not().isEmpty().withMessage('Please Enter Your Password')
        .isLength({max: 25}).withMessage('Length Of Password Limits By 25 Character').escape()
], memberLogin.loginProcess)

module.exports = router