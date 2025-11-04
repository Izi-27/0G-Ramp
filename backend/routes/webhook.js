const express = require('express')
const router = express.Router()
const controller = require('../controllers/webhook')

router.post('/payment', controller.paymentCallback)
router.post('/offramp', controller.offrampCallback)

module.exports = router