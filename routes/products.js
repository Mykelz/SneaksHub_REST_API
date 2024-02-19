const express = require('express');

const productController = require('../controllers/product');
const isAuth = require('../middleware/is-Auth');

const router = express.Router();

router.get('/products', productController.getProdcts)

router.get('/product/:productId', productController.getProduct);

router.post('/cart/:productId', isAuth, productController.addToCart);

router.get('/cart', isAuth, productController.getCart)

router.post('/cart/delete/:productId', isAuth, productController.removeFromCart)

router.post('/delete-cart', isAuth, productController.deleteCart)

router.post('/checkout', isAuth, productController.checkout);

router.post('/order/:orderId', isAuth, productController.orderNow);

router.get('/verifyPayment/:paystack_ref', isAuth, productController.verifyTrans);

router.get('/orders', isAuth, productController.getOrders)

module.exports = router;