const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
require('dotenv').config();

const authRoute = require('./routes/auth')


const app = express()

app.use(bodyParser.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      '*'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });


app.use('/auth',authRoute);


app.use((error, req, res, next)=>{
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data
  res.status(status).json({ message: message, data: data})
}) 



mongoose.connect(process.env.CONNECT)
    .then( result =>{
        app.listen(process.env.PORT || 6000)
    })
    .catch( err=>{
        console.log(err)
    })
