const Product = require('../models/product');
const User = require('../models/auth');
const Category = require('../models/category');
const { validationResult } = require("express-validator");



exports.postAddProduct = (req, res, next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Please enter valid product details");
      error.data = errors.array();
      error.statusCode = 422;
      throw error;
      
    }

    const categoryId = req.params.categoryId;
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const images = req.files

    if (!images){
        console.log("No file received");
        const error = new Error('No file received');
        throw error;
    }
    imageUrl = images.map( i =>{
        return i.path
    })
    const product = new Product ({
        title: title,
        price: price,
        description: description,
        category: categoryId,
        creator: req.userId,
        imageUrl: imageUrl

    });
    console.log(images.map( i =>{
        return i.path
    }))
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
        console.log(err)
    })
}

exports.getShop = async (req, res, next) =>{
    try{
        const user = await User.findById(req.userId)
        const userObj = await user.populate('shop', 'title price description category')
        console.log(userObj)
        res.status(200).json({
                    products: userObj.shop
                })
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err);
    }
}

exports.editProduct = async (req, res, next) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Please enter valid product details");
      error.data = errors.array();
      error.statusCode = 422;
      throw error;
    }


    const productId = req.params.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;

    try {
        const product = await Product.findById(productId)
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDescription;
        
        const updatedProduct = await product.save();
        res.status(200).json({
            updatedProduct: updatedProduct
        })
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err)
    }
}


exports.deleteProduct = async (req, res, next) =>{
    const productId = req.params.productId;

    try{
        const deletedProduct = await Product.findByIdAndDelete(productId);
        const categoryId = deletedProduct.category;
        await Category.updateOne({ _id: categoryId}, {$pull: { products: productId}})
        await User.updateOne({ _id: req.userId}, {$pull: { shop: productId}})

        res.status(200).json({
            msg: 'Product deleted successfully'
        })
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err)
    }

}
