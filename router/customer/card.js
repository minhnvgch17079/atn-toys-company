const express = require('express')
let router = express.Router()
let card = require('../../controllers/customer/controller-card')

router.get('/', card.seeCard)

router.get('/:id', card.addToCard)

router.get('/delete/:id', card.deleteProductInCard)

router.get('/order/ok', card.makeOrderFromCard)
module.exports = router