var mongoose = require("mongoose");
var Account = require("./Account").Account;

var questionSchema = new mongoose.Schema({
    type: String,
    title: String,
    content: String,
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
    createdAt: {type:Date,default:Date.now}
});

var Question = mongoose.model('Question', questionSchema);

module.exports = {
    Question: Question
};