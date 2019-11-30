const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const Evaluation=new Schema({
    evaluator:String,
    seller:String,
    evaluation_grade:String,
    transaction_id: mongoose.Schema.Types.ObjectId,
    comment:String,
    evaluation_date:{type:Date,default:Date.now}

});

module.exports=mongoose.model("Evaluation",Evaluation);