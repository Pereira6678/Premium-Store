const express = require('express');
const auth = require('../middleware/auth');
const { createOrder, listOrders } = require('../controllers/orderController');

const router = express.Router();

router.post('/', auth, createOrder);
router.get('/', auth, listOrders);

module.exports = router;
