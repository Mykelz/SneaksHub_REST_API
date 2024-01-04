const Product = require('../models/product');
const User = require('../models/auth');
const Order = require('../models/order');

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

exports.addToCart = async (req, res, next) =>{
    const productId = req.params.productId;
    try{
        const product = await Product.findById(productId);
        console.log(product)
        const user = await User.findById(req.userId);
        
        const cart = await user.addToCart(product);

        res.status(200).json({
            msg: 'succesfully added to cart', cart: cart.cart.items
        })
    }catch(err){
        if (!err.statusCode){
            err.statusCode = 500;
        }
        console.log(err)
        next(err)
    }
}

exports.getCart = (req, res, next) =>{
    User.findById(req.userId)
        .then(user=>{
            console.log(req.userId)
            return user.populate('cart.items.productId') 
        })
        .then(cartProducts=>{~
            console.log(cartProducts);
            res.json({
                cart: cartProducts.cart.items
            })
        })
        .catch(err=>{
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err)
        })
}

exports.deleteCart = async (req, res, next) =>{
    const productId = req.body.productId;
    try{
        const user = await User.findById(req.userId);
        const removeCart = await user.removeFromCart(productId);
    
        res.status(200).json({
            msg: 'successfully removed from cart'
        })
    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err)
        console.log(err)
    }
    
}

exports.postOrder = async (req, res, next) =>{
    try{
        const user = await User.findById(req.userId);
        const cartItems = await user.populate('cart.items.productId')
        const products = user.cart.items.map( i =>{
            return { quantity: i.quantity, product: { ...i.productId._doc } }
          })
        if (products.length <= 0){
            const error = new Error('Please add some product(s) to cart before making an order');
            error.statusCode = 400;
            throw error;
        }
        const order = new Order({
            user: {
                email: user.email,
                userId: req.userId
            },
            products: products
        })
        await order.save();
        await user.clearCart();

        res.status(200).json({
            msg: 'order saved'
        })
    }catch(err){
        if (!err.statusCode){
            err.statusCode = 500;
        }
        console.log(err)
        next(err)
    }
}

exports.getOrders =async (req, res, next) =>{
    const order = await Order.find({'user.userId': req.userId });
    if (!order){
        const error = new Error('You have not made any order');
        error.statusCode = 401
        throw error;
    }
    res.status(200).json({
        order: order
    })
}