const Category = require('../models/category');
const  User = require('../models/auth');
const { validationResult } = require('express-validator'); 

const redis = require('redis');
let redisClient;


(async () => {
    redisClient = redis.createClient();
  
    redisClient.on("error", (error) => console.error(`Error : ${error}`));
  
    await redisClient.connect();
  
  })();

exports.addCategory = (req, res, next) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Please enter valid Category details");
      error.data = errors.array();
      error.statusCode = 422;
      throw error;
    }

    User.findById(req.userId)
        .then(user=>{
            if(user.isAdmin !== true){
                const error = new Error('Only Admins can access this route');
                error.statusCode = 401;
                throw error;
            }
            const title = req.body.title;
            const description = req.body.description;
    
            const category = new Category({
                title: title,
                description: description
            })
            category.save()
                .then( newCategory =>{
                    res.status(201).json({ category: newCategory})
                })
                })
        .catch(err =>{
            if (!err.statusCode){
                err.statusCode = 500;
            }
            next(err)
        })

}   

exports.getAllCategory = (req, res, next) =>{
    Category.find()
        .then(allCategories=>{
            res.status(201).json({ category: allCategories});
        })
        .catch(err=>{
        if (!err.statusCode){
            err.statusCode = 500;
        }
           next(err)
        })
}   



exports.updateCategory = (req, res, next) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Please enter valid Category details");
      error.data = errors.array();
      error.statusCode = 422;
      throw error;
    }

    const categoryId = req.params.categoryId;

    const title = req.body.title;
    const description = req.body.description;

    User.findById(req.userId)
        .then(user=>{
            if (user.isAdmin !== true){
                const error = new Error('Only Admins are permitted to access this route')
                error.statusCode = 500;
                throw error;
            }
            Category.findByIdAndUpdate(categoryId)
                .then(updtCategory=>{
                    updtCategory.title = title;
                    updtCategory.description = description
                    return updtCategory.save()
                        .then(result=>{
                            res.status(200).json({ updatedCategory: updtCategory})
                    })
                    })
                
        })
        .catch(err =>{
            if (!err.statusCode){
                err.statusCode = 500;
            }
               next(err)
        })
}

exports.displayProductsByCategory = async (req, res, next) =>{
    const categoryId = req.params.categoryId;
    let products;

    try{
        const catProds = await redisClient.get('catProds');
        if (catProds){
            products = JSON.parse(catProds);
            console.log('cache hit');
            res.status(200).json(products)
        }else{
            const getCategory = await Category.findById(categoryId);
            const category = await getCategory.populate({path: 'products'});
            console.log('cache miss')
            products = { categoryTitle: category.title, categoryId: category._id, products: category.products }
            await redisClient.setEx('catProds', 3600, JSON.stringify(products));
            res.status(200).json(products)
        }
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }

}

