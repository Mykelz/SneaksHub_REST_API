const { validationResult } = require('express-validator');

const User = require('../models/auth');
const bcrypt = require('bcryptjs');


exports.signup = async (req, res, next) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        const error = new Error('validation failed, entered data is incorrect');
        error.statusCode = 422;
        error.data = errors.array()
        throw error;
    }

    

    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const phoneNum = req.body.phoneNum;
    const hashedPw = await bcrypt.hash(password, 12)

    const userEmail = await User.findOne({ email: email})
    if (userEmail){
        const error = new Error('Email already exists')
        error.statusCode = 422;
        throw error
    }
    try {
            const user = new User({
                firstname: firstname,
                lastname: lastname,
                username: username,
                email: email,
                password: hashedPw,
                phoneNum: phoneNum
        })
        const result = await user.save();
        res.status(201).json({ message: 'User created successfully', userId: result._id})
    } catch (err) {
        if (!err.statusCode){
            err.statusCode = 500
        }
        next(err)
    }
}