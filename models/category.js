const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    title: {
        required: true,
        type: String
    },
    description: {
        required: true,
        type: String
    },
    products: [
        {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }
]
})


module.exports = mongoose.model('Category', categorySchema)