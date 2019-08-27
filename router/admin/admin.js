const express = require('express')
let router = express.Router()
let {check, validationResult} = require('express-validator')
let controller_admin = require('../../controllers/admin/controller-admin')
router.get('/', controller_admin.checkAdminLogin) //IF ADMIN LOGINED, SHOW ADMIN UI, IF NOT SHOW LOGIN FORM
router.post('/', controller_admin.loginAdmin)
router.get('/processorder', controller_admin.processCustomerOrder) // PROCESS CUSTOMER ORDER
router.get('/adminmyorder/:id', controller_admin.seeDetailOrder) //SEE CUSTOMER ORDER DETAIL
router.post('/refuse', controller_admin.refuse) //REFUSE PRODUCT
router.get('/product', controller_admin.confirmProduct) //CONFIRM PRODUCT
router.get('/:id', controller_admin.adminUI) //MANAGEMENT UI FOR ADMIN AND MANAGE STORE ACCOUNT
router.post('/:id', controller_admin.statistics) // SHOW STATISTICS OF EACH STORE


module.exports = router