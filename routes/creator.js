const express = require('express');
const { body } = require('express-validator')
const creatorController = require('../controllers/creator')

const isAuth = require('../middleware/is-Auth')

const router = express.Router();


router.post('/add-product/:categoryId', [
    body('title')
    .trim().not().isEmpty().isLength({min: 3, max: 25}).withMessage('please Enter product title'),
    body('price')
    .trim().not().isEmpty().withMessage('please Enter product price'),
    body('description')
    .trim().not().isEmpty().isLength({min: 20, max: 150}).withMessage('please Enter product description')
], isAuth, creatorController.postAddProduct);

router.get('/Shop', isAuth, creatorController.getShop);

router.put('/edit-product/:productId', [
    body('title')
    .trim().not().isEmpty().isLength({min: 3, max: 25}).withMessage('please Enter product title'),
    body('price')
    .trim().not().isEmpty().withMessage('please Enter product price'),
    body('description')
    .trim().not().isEmpty().isLength({min: 20, max: 150}).withMessage('please Enter product description')
], isAuth, creatorController.editProduct);

router.delete('/delete-product/:productId', isAuth, creatorController.deleteProduct);


module.exports = router;