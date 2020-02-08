const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const Account=new Schema({
    userid:String,
    password:String,
    salt: String,
    profile:{
        name:String,
        thumbnail:{type:String,default:"../public/images/clockrabbit.png"},
        introduce:String
    },
    email:String,
    address:String,
    phone:String,
    birth:String,
    point:{
        type: Number,
        default: 0
    },//수정됨
    score:{
        type: Number,
        default: 0
    },
    prefertags:Array,
    recent_products:Array,
    createdAt:{type:Date,default:Date.now}
});

module.exports=mongoose.model("Account",Account);