const express = require('express')
const router = express.Router()

let store = require('../controllers/controller.store.product')
router.use('/', store.checkStore)

router.get('/', store.showProduct)

module.exports = router