const express=require('express');
const account=require('./Account_route');
const product=require('./Product_route');
const transaction=require('./Transaction_route');
const point = require("./Point_route");
const design = require("./design_route");
const question = require("./Question_route");
const mypage=require("./Mypage_route");
const ranking=require("./Ranking_route");
let session=require('express-session');

var Design = require('../models/Design');
const Purchase = require('../models/Purchase').Purchase;
const purchase = require("./Purchase_route");

const Product=require("../models/Product");

const router=express.Router();


router.get('/',function(req,res){
    session =req.session;
    res.render('index',{session:session});
})
router.get('/register',function(req,res){
    res.render('register');
});

router.get('/main',function(req,res){
    session =req.session;
    var designList, purchaseList = [];
    let newlist=[]
    Product.find({}).sort('-createdAt').limit(4).exec(function(err,product){
        for(var i=0;i<product.length;i++){
            var data={
                _id:product[i]._id,
                product_name:product[i].product_name,    
                userid:product[i].userid,
                price:product[i].price,
                thumbnail:product[i].thumbnail,
                tag:product[i].tag,
            }
            newlist.push(data)
        }
        session.newItem={
            list:newlist
        }
    });
    Product.find({}).sort({'saleCount':-1}).limit(5).exec(function(err,product){
        if (err) throw err;
        let list=[]
        for(var i=0;i<product.length;i++){
            var data={
                _id:product[i]._id,
                product_name:product[i].product_name,    
                thumbnail:product[i].thumbnail,
                tag:product[i].tag,
            }
            list.push(data)
        }
        session.bannerImg={
            list:list
        }
        Design.find({}).populate('writer').sort({'createdAt':-1}).limit(4).exec(function(err,designResult){
            if(err) throw err;
            Purchase.find({}).populate('writer').sort({'createdAt':-1}).limit(4).exec(function(pErr,purchaseResult){
                if(pErr) throw pErr;
                return res.render('main',{session:session, purchaseList:purchaseResult, designList:designResult});
            });
        });
    });
})

router.get('/login',function(req,res,next){
    session=req.session;
    res.render('login',{session:session});
})
 
// Product ejs
router.get('/sale_post',function(req,res,next){
    session=req.session;
    res.render('sale_post',{session:session});
})

router.get('/evaluation',function(req,res,next){
    session=req.session;
    session.evaluationId=req.query.transactionId;
    res.render('evaluation',{session:session});
})

//mypage ejs
// router.get('/mypage',function(req,res,next){
//     session=req.session;
//     res.render('mypage',{session:session});
// })

router.use('/account',account);
router.use('/product',product);
router.use('/point',point);
router.use('/question',question);
router.use('/transaction',transaction);
router.use('/mypage',mypage);
router.use('/ranking',ranking);
router.use('/design',design);
router.use('/purchase',purchase);

module.exports=router;