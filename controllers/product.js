const Product = require('../models/product');

exports.getProduct = async( req, res, next) =>{
    const productId = req.params.productId;

    try{
        const product = await Product.findById(productId);
        const creator = await product.populate('creator');
        const categoryId = product.category;
        const category = await product.populate('category');
        // console.log(product)
        res.status(200).json({
            product: {
                id: product._id,
                title: product.title,
                price: product.price,
                descritption: product.description,
                SellerPhoneNum: product.creator.phoneNum,
                categoryName: product.category.title
            }
        })
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err)
    }


}