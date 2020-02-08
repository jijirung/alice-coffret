var mongoose = require('mongoose');
var Account = require("./Account").Account;
 
 
var Purchase= new mongoose.Schema({
    title: String,
    contents: String,
    image: String,
    kinds:String,
    writer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    },
    tag: Array,
    price: Number,
    sponsor: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Account'
        },
        createdAt: {type:Date,default:Date.now}
    }],
    comments: [{
        writer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Account'
        },
        content: String,
        createdAt: {type:Date,default:Date.now}
    }],
    goal: Number,
    createdAt: {type:Date,default:Date.now},
    endDate: {type:Date}
});

var Purchase = mongoose.model('Purchase', Purchase);

module.exports = {
    Purchase: Purchase
};