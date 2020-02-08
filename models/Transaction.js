const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const Transaction=new Schema({
    product_name:String,
    purchaser:String,
    sellers: String,
    transaction_quantity:Number,
    transaction_price:Number,
    transaction_status:String,
    transaction_strart_date:{type:Date,default:Date.now},
    delivery_date:{type:Date},
    transaction_end_date:{type:Date},
});

module.exports=mongoose.model("Transaction",Transaction);