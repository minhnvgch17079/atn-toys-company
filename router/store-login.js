const express = require('express')
const router = express.Router()

const {check, validationResult} = require('express-validator')

let storeAdd = require('./store-add')
router.use('/add', storeAdd)

let storeProduct = require('./store-product')
router.use('/product', storeProduct)

let storeDelete = require('./store-delete')
router.use('/delete', storeDelete)

let storeEdit = require('./store-edit')
router.use('/edit', storeEdit)

let store = require('../controllers/controller.store.login')

router.get('/', store.checkStore)
router.post('/', [
    check('username').not().isEmpty().withMessage('Please In Put Your UserName')
        .isLength({max: 25}).withMessage('Length Of User Name Limits By 25 Characters'),
    check('password').not().isEmpty().withMessage('Please Input Your Password')
        .isLength({max: 25}).withMessage('Length Of Password Limits By 25 Characters')
], store.processLogin)

module.exports = router