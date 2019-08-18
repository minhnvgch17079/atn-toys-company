const express = require('express')
const router = express.Router()

let store = require('../controllers/controller.store.add')
router.use('/', store.checkStore)
router.get('/', store.showFormAddProduct)
router.post('/', store.processAddProduct)

module.exports = router