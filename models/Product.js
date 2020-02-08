const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const Product=new Schema({
    product_name:String,
    userid:String,
    name:String,
    content:{type:String ,default:"내용 없음"},
    product_quantity:Number,
    price:Number,
    category:String,
    thumbnail:{type:String,default:"../public/images/noimage.png"},
        // images:{
        //     type:Array,default:"../public/images/noimage.png"
        // }
    tag:Array,
    saleCount:Number,
    recent_product:{type:String,default:''},
    createdAt:{type:Date,default:Date.now}
});

module.exports=mongoose.model("Product",Product);