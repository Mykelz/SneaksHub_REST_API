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
    token: String,
    tokenExpiration: Date,
    isAdmin: {
        type: Boolean,
        default: false
    },
    shop: [
    {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }
        ],

    cart: {
        items: [
           {
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
           }
        ]
    }
});

// this function finds the index of the product that is being added to the cart
userSchema.methods.addToCart = function(product){
    const cartProductIndex = this.cart.items.findIndex( cp =>{
       return cp.productId.toString() === product._id.toString()
    })
    let newQuantity = 1;
// stores all properties of the existing cart items inside the "updatedCartItems" const
    const updatedCartItems = [ ...this.cart.items]

// Checks if the cartProductIndex returns a negative or postive value
// positive value means product being added is already on the cart negative value means product isnt in the cart
    if (cartProductIndex >= 0){
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    }else{
        updatedCartItems.push({
            productId: product._id,
            quantity: newQuantity
        });
    }
// stores and save the updatedCartItems into the updatedCart
    const updatedCart = {
        items: updatedCartItems
    };
    this.cart = updatedCart;
     return this.save();
};

// This method allows a user to remove a particular item from cart
userSchema.methods.removeFromCart = function(productId){
    const updatedCartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== productId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
}

// This method clears all items in a cart
userSchema.methods.clearCart = function() {
    this.cart = { items: [] };
    return this.save();
  };

module.exports = mongoose.model('User', userSchema);