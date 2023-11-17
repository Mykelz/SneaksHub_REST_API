const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const productSchema = new Schema({
    title: {
        required: true,
        type: String
    },

    price: {
        required: true,
        type: Number
    },

    description: {
        required: true,
        type: String
    },

    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

})


module.exports = mongoose.model('Product', productSchema);