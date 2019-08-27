const express = require('express')
const router = express.Router()

const {check, validationResult} = require('express-validator')

let storeAdd = require('./add-product')
router.use('/add', storeAdd)

let storeProduct = require('./list-product')
router.use('/product', storeProduct)

let storeDelete = require('./delete-product')
router.use('/delete', storeDelete)

let storeEdit = require('./edit-product')
router.use('/edit', storeEdit)

let store = require('../../controllers/store/controller-login')
router.get('/', store.checkStore)
router.post('/', store.processLogin)

module.exports = router