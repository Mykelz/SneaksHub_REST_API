const Category = require('../models/category');
const  User = require('../models/auth');


exports.addCategory = (req, res, next) =>{
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
    const categoryId = req.params.categoryId;

    const title = req.body.title;
    const description = req.body.description;

    Category.findByIdAndUpdate(categoryId)
        .then(updtCategory=>{
            updtCategory.title = title;
            updtCategory.description = description
            res.status(200).json({ updatedCategory: updtCategory})
        })
        .catch(err =>{
            if (!err.statusCode){
                err.statusCode = 500;
            }
               next(err)
        })
}
