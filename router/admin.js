const express = require('express')
let router = express.Router()
let {check, validationResult} = require('express-validator')
let controller_admin = require('../controllers/controller.admin')

router.get('/', controller_admin.checkAdminLogin) //IF ADMIN LOGINED, SHOW ADMIN UI, IF NOT SHOW LOGIN FORM
router.post('/',[
    check('username').not().isEmpty().withMessage('Please Enter Your User Name')
         .isLength({max: 25}).withMessage('Length Of Ueser Name Limits By 25 Characters').escape(),
    check('password').not().isEmpty().withMessage('Please Input Password')
        .isLength({max: 25}).withMessage('Length Of Password Limits by 25 character').escape(),
    check('password2').not().isEmpty().withMessage('Please Input Password')
        .isLength({max: 25}).withMessage('Length Of Password Limits by 25 character').escape()  
], controller_admin.loginAdmin)
router.get('/processorder', controller_admin.processCustomerOrder) // PROCESS CUSTOMER ORDER
router.get('/adminmyorder/:id', controller_admin.seeDetailOrder) //SEE CUSTOMER ORDER DETAIL
router.post('/refuse', controller_admin.refuse) //REFUSE PRODUCT
router.get('/product', controller_admin.confirmProduct) //CONFIRM PRODUCT
router.get('/:id', controller_admin.adminUI) //MANAGEMENT UI FOR ADMIN AND MANAGE STORE ACCOUNT
router.post('/:id', controller_admin.statistics) // SHOW STATISTICS OF EACH STORE


module.exports = router