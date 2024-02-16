const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    products: [
        {
        product: {
             type: Object, 
             required: true
            },
        quantity: {
             type: Number,
              required: true
            },
            productPrice: {
                type: Number,
                required: true
            },
            totalProductPrice: {
                type: Number,
                required: true
            }
         }
    ],

    totalPrice: {
        type: Number,
        required: true
    },

    user: {
        email: {
            type: String,
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    } ,
    status: { 
        type: String,
        default: 'pending'
    },
    paystack_ref: {
        type: String,
        default: ''
    }
})

module.exports = mongoose.model('Order', orderSchema)