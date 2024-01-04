const express = require('express');
const { body } = require('express-validator');
const shopController = require('../controllers/Shop');
const isAuth = require('../middleware/is-Auth');
const multer = require('multer');
const path = require('path')

const storage = multer.diskStorage({
    destination: ( req, file, cb) => {
      cb(null, 'images/')
    },

    filename: (req, file, cb) => {
      cb( null, Date.now() + path.extname(file.originalname))
    }
  })

  const fileFilter = (req, file, cb) =>{
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpeg'){
        cb(null, true)
    }else{
        cb(null, false)
    }
  }

const upload = multer({ storage: storage, fileFilter: fileFilter, limits: { fileSize: 1 * 1024 * 1024 } })


const router = express.Router();


router.post('/add-product/:categoryId', upload.array('images', 4), isAuth, [
    body('title')
    .trim().not().isEmpty().isLength({min: 3, max: 25}).withMessage('please Enter product title'),
    body('price')
    .trim().not().isEmpty().withMessage('please Enter product price'),
    body('description')
    .trim().not().isEmpty().isLength({min: 15, max: 150}).withMessage('please Enter product description with a min length of 15 and max length of 150')
], isAuth, shopController.postAddProduct);

router.get('/Shop', isAuth, shopController.getShop);

router.put('/edit-product/:productId', isAuth, [
    body('title')
    .trim().not().isEmpty().isLength({min: 3, max: 25}).withMessage('please Enter product title'),
    body('price')
    .trim().not().isEmpty().withMessage('please Enter product price'),
    body('description')
    .trim().not().isEmpty().isLength({min: 20, max: 150}).withMessage('please Enter product description')
], isAuth, shopController.editProduct);

router.delete('/delete-product/:productId', isAuth, shopController.deleteProduct);


module.exports = router;