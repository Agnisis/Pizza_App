const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,  //relation of order to user colection
        ref: 'user',
        required: true,
    },

    items: { type: Object, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    paymentType:{type:String,default:'COD'},
    Status:{type:String,default:'Order_Placed'},




}, { timestamps: true })
module.exports = mongoose.model('Order', orderSchema)