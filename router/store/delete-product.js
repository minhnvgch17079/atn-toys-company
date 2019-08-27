const express = require('express')
const router = express.Router()
let store = require('../../controllers/store/controller-delete-product')
router.use('/', store.checkStore)
router.get('/:id', store.processDelete)

module.exports = router