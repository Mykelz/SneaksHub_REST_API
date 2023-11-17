const express = require('express');

const categoryController = require('../controllers/category');

const isAuth = require('../middleware/is-Auth');

const router = express.Router();



router.post('/category', isAuth, categoryController.addCategory)

router.get('/category', categoryController.getAllCategory);

router.put('/category', categoryController.updateCategory);



module.exports = router;
