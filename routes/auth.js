const express = require('express');
const {body} = require('express-validator');
const User = require('../models/auth');

const authController = require('../controllers/auth');

const router = express.Router()


router.post('/signup',[
    body('firstname').trim().not().isEmpty().withMessage('please Enter your first name'),
    body('lastname').trim().not().isEmpty().withMessage('please Enter your lastname'),
    body('username').trim().not().isEmpty().withMessage('please Enter a username'),
        // .custom((value, {req}) =>{
        //     return User.findOne({ username: value}).then(userName =>{
        //         if (userName){
        //             return Promise.reject('username already exists')
        //         }
        //     })
        // }),
    body('email')
    .not().isEmpty().withMessage('Email is a required field')
    .isEmail()
    .withMessage('Please enter a valid email')
    // .custom(( value, {req}) =>{
    //     return User.findOne({ email: value}).then(userDoc =>{
    //         if (userDoc){
    //             return Promise.reject('email address already exists!');
    //         }
    //     })
    // })
    .normalizeEmail(),
    body('password').trim().escape().isLength({min: 5}).withMessage('Please enter a stronger password'),
    body('phoneNum').isMobilePhone('en-NG').withMessage('Please enter a valid phone number')



], authController.signup)



module.exports = router;