const express = require('express');
const {body} = require('express-validator');
const User = require('../models/auth');

const authController = require('../controllers/auth');

const router = express.Router()


// POST/auth/signup
router.post('/signup',[
    body('firstname')
    .trim().not().isEmpty().withMessage('please Enter your first name'),
    body('lastname')
    .trim().not().isEmpty().withMessage('please Enter your lastname'),
    body('username')
    .trim().not().isEmpty().withMessage('username is a required field')
    .custom((value, {req}) =>{
        return User.findOne({ username: value}).then(userDoc =>{
            if (userDoc){
                return Promise.reject('username is already in use!')
            }
        
        })
    }),
    body('email')
    .not().isEmpty().withMessage('Email is a required field')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom(( value, {req}) =>{
        return User.findOne({ email: value}).then(userDoc =>{
            if (userDoc){
                return Promise.reject('email address already exists!');
            }
        })
    })
    .normalizeEmail(),
    body('password').trim().escape().isLength({min: 7}).withMessage('Please enter a stronger password'),
    body('confirmPassword').trim().escape().isLength({min: 7}).withMessage('Please enter a stronger password'),
    body('phoneNum').isMobilePhone('en-NG').withMessage('Please enter a valid phone number')



], authController.signup)

// GET/auth/emailConf/:token
router.get('/emailConf/:token', authController.emailConf)

// POST/auth/login
router.post('/login', authController.login)

// POST/auth/reset-password
router.post('/reset-password', authController.resetPassword);

// GET/auth/new-password/:token
router.get('/new-password/:token', authController.getNewPassword);

// POST/auth/new-password/:token
router.post('/new-password/:token', authController.postNewPassword);



module.exports = router;