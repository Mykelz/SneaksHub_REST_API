const User = require("../models/auth");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
require("dotenv").config();
const jwt = require('jsonwebtoken');

const { validationResult } = require("express-validator");

const formData = require("form-data");
const Mailgun = require("mailgun.js");
const mailgun = new Mailgun(formData);
const client = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY || "your-key-here",
  url: "https://api.mailgun.net",
});

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Invalid Credential");
    error.data = errors.array();
    error.statusCode = 422;
    throw error;
    console.log(error)
  }

  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword
  const phoneNum = req.body.phoneNum;

  if (password !== confirmPassword){
    const error = new Error('Passwords do not match');
    error.statusCode = 400;
    throw error
  }
  const token = crypto.randomBytes(6, (err, buffer) => {
      if (err) {
        const error = new Error("An error occured!");
        throw error;
      }
      const token = buffer.toString("hex");

      const messageData = {
        from: "obianukamicheal@gmail.com",
        to: email,
        subject: "Email confirmation",
        html: `<h2> You're almost there!</h2> <br> <p> Click this link to confirm your email and set up your account <a href='http://localhost:2020/auth/emailConf/${token}'>link</a></p>`,
      };

      bcrypt.hash(password, 12).then((hashedPw) => {
        const user = new User({
          firstname: firstname,
          lastname: lastname,
          username: username,
          email: email,
          password: hashedPw,
          phoneNum: phoneNum,
          token: token,
        });
        user.save().then( result=>{
            client.messages
            .create(
                "sandbox5385b2517fba48938a6d7f16dcba5349.mailgun.org", messageData)
            .then((data) => {
                res.status(200).json({
                msg: `Click the link we sent to ${email} to complete your account set-up.`,
                email: email,
                });
            })
        })
      })
      .catch(err=>{
        if (!err.statusCode){
          err.statusCode = 500;
        }
          next(err)
          console.log(err)
      })
    })
};


exports.emailConf = (req, res, next) =>{
    token = req.params.token;
    User.findOne({ token: token})
        .then(userDoc =>{
            if (!userDoc){
                const error = new Error('Please click the link sent to your email to verify your account, or proceed to login if you have verified your email already');
                throw error;
            }
                userDoc.updateOne({ token: null, verified: true }).then(result=>{
                    const messageData = {
                        from: "obianukamicheal@gmail.com",
                        to: userDoc.email,
                        subject: "Email confirmation",
                        html: `<h2> Welcome Onboard, ${userDoc.username}!</h2> <br> <p> Your emali has now been verified, you can now proceed to login.</a></p>`,
                      };
                      client.messages
                      .create(
                          "sandbox5385b2517fba48938a6d7f16dcba5349.mailgun.org", messageData)
                      .then((data) => {
                        res.status(200).json({ msg: 'Email verified successfully, you can now proceed to login'})
                      })
                })
        })
        .catch(err=>{
          if (!err.statusCode){
            err.statusCode = 500;
          }
            next(err)
        })
}


exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;

  User.findOne({ email: email })
    .then(user=>{
      if (!user){
        const error = new Error('No user is associated with this email');
        error.statusCode = 401;
        throw error;
      }
      if (user.verified === false){
        const error = new Error('you need to verify your email before you can login')
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isEqual=>{
      if (!isEqual){
        const error = new Error('Wrong password')
        error.statusCode = 500;
        throw error;
      }
      const token = jwt.sign(
        { email: loadedUser.email, userId: loadedUser._id},
        'averytopsecretsecret',
        { expiresIn: '1hr'}
      );
      res.status(200).json({ token: token, msg: 'you are logged in'})
    })
    .catch(err=>{
      if (!err.statusCode){
        err.statusCode = 500;
      }
      next(err)
    })
  }