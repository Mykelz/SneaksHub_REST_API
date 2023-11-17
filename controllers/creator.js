const Product = require('../models/product');
const User = require('../models/auth');
const Category = require('../models/category');



exports.postAddProduct = (req, res, next) =>{
    const categoryId = req.params.categoryId;
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;


    const product = new Product ({
        title: title,
        price: price,
        description: description,
        category: categoryId,
        creator: req.userId
    });

    product.save().then(product=>{
        User.findById(req.userId)
            .then(user =>{
                user.shop.push(product);
                return user.save();
        })
        Category.findById(categoryId)
        .then(category=>{
            category.products.push(product)
            return category.save()
        })
    })
    .then(result=>{
        res.status(201).json({ 
            product: result,
            msg: 'Product created succesfully', 
            productId: product._id, 
            creatorId: req.userId
        })
    })
    .catch(err=>{
        if (!err.statusCode){
            err.statusCode = 500
        }
        next(err)
    })
}

// exports.getShop = (req, res, next) =>{
    
// }

// exports.editProduct = (req, res, next) =>{

// }

// exports.deleteProduct = (req, res, next) =>{

// }
