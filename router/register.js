const express = require('express')
let {check, validationResult} = require('express-validator')
let router = express.Router()

let register = require('../controllers/controllers.member.register')
router.get('/', (req, res) => {
    res.render('register')
})
router.post('/', [
    check('username').not().isEmpty().withMessage('Please Input UserName')
        .isLength({max: 25}).withMessage('Length Of UserName Limits By 25 Characters').escape(),
    check('password').not().isEmpty().withMessage('Please Input Password')
        .isLength({max: 25}).withMessage('Length Of Password Limits By 25 Characters').escape()
], register.processRegister)

module.exports = router