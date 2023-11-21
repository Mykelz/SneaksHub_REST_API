const express = require('express');

const { body } = require('express-validator')
const categoryController = require('../controllers/category');

const isAuth = require('../middleware/is-Auth');

const router = express.Router();



router.post('/category', [
    body('title')
    .trim().not().isEmpty().withMessage('please Enter Category title'),
    body('description')
    .trim().not().isEmpty().withMessage('please Enter Category Description')
], isAuth, categoryController.addCategory)

router.get('/category', isAuth, categoryController.getAllCategory);

router.put('/category', [
    body('title')
    .trim().not().isEmpty().withMessage('please Enter Category title'),
    body('description')
    .trim().not().isEmpty().withMessage('please Enter Category Description')

], isAuth, categoryController.updateCategory);



module.exports = router;
