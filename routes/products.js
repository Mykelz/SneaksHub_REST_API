const express = require('express');

const productController = require('../controllers/product');
const isAuth = require('../middleware/is-Auth');

const router = express.Router();


router.get('/product/:productId', productController.getProduct);

router.post('/cart/:productId', isAuth, productController.addToCart);

router.get('/cart', isAuth, productController.getCart)

router.post('/delete-cart', isAuth, productController.deleteCart)

module.exports = router;