const Product = require('../models/product');
const User = require('../models/auth');
const Order = require('../models/order');
const https = require('https')
require('dotenv').config();

const Paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY)

exports.getProdcts = async( req, res, next) =>{
    const ITEMS_PER_PAGE = 4;
    const page = req.query.page;
    try{
        const products = await Product.find()
           .skip((ITEMS_PER_PAGE - page) * page)
            .limit(ITEMS_PER_PAGE)
            .exec();
        res.status(201).json({
            prosucts: products
        })
    }
    catch(err){
        if (!err.statusCode){
            err.statusCode = 500;   
        }
        next(err)
    }
}

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
        const user = await User.findById(req.userId);
        
        const cart = await user.addToCart(product);

        res.status(200).json({
            msg: 'succesfully added to cart', cart: cart.cart.items, totalPrice: cart.cart.totalPrice
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
        .then(cartProducts=>{
            console.log(cartProducts);
            res.json({
                cart: cartProducts.cart.items,
                totalPrice: cartProducts.cart.totalPrice
            })
        })
        .catch(err=>{
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err)
        })
}

exports.removeFromCart = async (req, res, next) =>{
    const productId = req.params.productId;

    try{
        const user = await User.findById(req.userId);
        await user.removeFromCart(productId);
    
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

exports.deleteCart = async (req, res, next) =>{
    try{
        const user = await User.findById(req.userId);
        await user.clearCart();
        res.status(200).json({
            msg: 'cart cleared succesfully'
        })
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err)
        console.log(err)
    }
}

exports.checkout = async (req, res, next) =>{
    try{
        // gets the id of the logged in user
        const user = await User.findById(req.userId);
        // populates the cart items of the logged in user
        const cartItems = await user.populate('cart.items.productId')
        // the map function creates a new array of products and quantity existing in the cart and stores it in the products const
        const products = user.cart.items.map( i =>{
            return { quantity: i.quantity, productPrice: i.productPrice, 
                        totalProductPrice: i.totalProductPrice, product: { ...i.productId._doc } }
          })
          console.log(products)
        // this statement checks if there is product(s) in the cart and throws an error if there is not
        if (products.length <= 0){
            const error = new Error('Please add some product(s) to cart before making an order');
            error.statusCode = 400;
            throw error;
        }
        // create and saves the new order
        const order = new Order({
            user: {
                email: user.email,
                userId: req.userId
            },
            totalPrice: user.cart.totalPrice,
            products: products
        })
        await order.save();
        await user.clearCart();

        res.status(200).json({
            msg: 'order saved',
            data: order
        })
    }catch(err){
        if (!err.statusCode){
            err.statusCode = 500;
        }
        console.log(err)
        next(err)
    }
}


exports.orderNow = async ( req, res, next)=>{
    
    try {
        const orderId = req.params.orderId;
        const order = await Order.findById(orderId);

        const amount = order.totalPrice;
        const email = order.user.email;

        const params = JSON.stringify({
          "email": email,
          "amount": amount * 100
        })

        const options = {
          hostname: 'api.paystack.co',
          port: 443,
          path: '/transaction/initialize',
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
          }
        }
        // client request to paystack API
        const clientReq = https.request(options, apiRes => {
          let data = ''
          apiRes.on('data', (chunk) => {
            data += chunk
          });
          apiRes.on('end', () => {
            console.log(JSON.parse(data));
            return res.status(200).json(data);
          })
        }).on('error', error => {
          console.error(error)
        })
        clientReq.write(params)
        clientReq.end()
        
      } catch (error) {
        // Handle any errors that occur during the request
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
      }

}

exports.verifyTrans = async (req, res, next) =>{

    const paystack_ref = req.params.paystack_ref;

    try {
        const options = {
          hostname: 'api.paystack.co',
          port: 443,
          path: `/transaction/verify/${paystack_ref}`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
          }
        }
  
        const apiReq = https.request(options, (apiRes) => {
          let data = '';
    
          apiRes.on('data', (chunk) => {
            data += chunk;
          });
    
          apiRes.on('end', () => {
            console.log(JSON.parse(data));
            return res.status(200).json(data);
          });
        });
    
        apiReq.on('error', (error) => {
          console.error(error);
          res.status(500).json({ error: 'An error occurred' });
        });
    
        // End the request
        apiReq.end();
      
      } catch (error) {
        if (!err.statusCode){
            err.statusCode = 500;
        }
        next(err)
      }
    
}

exports.getOrders =async (req, res, next) =>{
    try{
        const order = await Order.find({'user.userId': req.userId });
        if (!order){
            const error = new Error('You have not made any order');
            error.statusCode = 401
            throw error;
        }
        res.status(200).json({
            order: order
        })
    }catch(err){
        if (!err.statusCode){
            err.statusCode = 500;
        }
        next(err)
    }
   
}

