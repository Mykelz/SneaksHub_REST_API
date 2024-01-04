const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoute = require('./routes/auth');
const categoryRoute = require('./routes/category');
const shopRoute = require('./routes/Shop');
const productRoute = require('./routes/products');

const app = express()

app.use(bodyParser.json())

app.use( (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "*");
  next();
});

app.use('/auth',authRoute);
app.use(productRoute);
app.use(categoryRoute);
app.use(shopRoute);

app.use('/uploads', express.static('uploads'));
app.use((error, req, res, next) =>{
  const data = error.data;
  const status = error.statusCode || 500;
  const message = error.message || 'an error occcured';
  res.status(status).json({ message: message, data: data})
})

mongoose.connect(process.env.CONNECT)
    .then( result =>{
        app.listen(process.env.PORT || 6000)
        
    })
    .catch( err=>{
        console.log(err)
    })
