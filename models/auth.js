const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNum: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    token:{
        type: String,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    shop: [
    {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }
        ]
});



module.exports = mongoose.model('User', userSchema);