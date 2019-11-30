var mongoose = require("mongoose");
var Account = require("./Account").Account;

var Schema = mongoose.Schema;
 
 
var designSchema = new Schema({
    image: String,
    title: String,
    prediction_price: Number,
    kinds: String,
    contents: String,
    tag: Array,
    like: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Account'
        },
    }], 
    writer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    },
    comments: [{
        writer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Account'
        },
        content: String,
        createdAt: {type:Date,default:Date.now}
    }],
    createdAt: {type:Date,default:Date.now},
    endDate: {type:Date}
});
 
module.exports = mongoose.model('design', designSchema);