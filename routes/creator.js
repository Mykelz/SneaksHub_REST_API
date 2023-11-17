const express = require('express');

const creatorController = require('../controllers/creator')

const isAuth = require('../middleware/is-Auth')

const router = express.Router();


router.post('/add-product/:categoryId', isAuth, creatorController.postAddProduct);

// router.get('/Shop', creatorController.getShop);

// router.put('/edit-product', creatorController.editProduct);

// router.delete('/delete-product', creatorController.deleteProduct);


module.exports = router;