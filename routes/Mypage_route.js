const express = require('express');
const router = express.Router();
const moment = require('moment');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const Evaluation = require('../models/Evaluation');
const Product=require("../models/Product");
const multer = require('multer');
const bkfd2Password = require('pbkdf2-password');
const hasher = bkfd2Password();
const Purchase = require('../models/Purchase').Purchase;
const Design = require('../models/Design');

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'public/images')
    },
    filename: function (req, file, callback) {
        callback(null, req.session.loginInfo.userid + file.originalname.replace(" ", ""));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        files: 10,
        fileSize: 1024 * 1024 * 1024
    }
})

router.get('/', function (req, res) {
    session = req.session;
    //현재 로그인한 사용자
    let user = session.loginInfo.userid;
    let userObjId = session.loginInfo._id
    let evaluation_list = [];
    let thumbnail_list=[];
    // 로그인 정보가 없을경우 로그인 창으로
    if (!session.loginInfo) {
        return res.render('login', { session: session });
    }

    Account.findOne({ userid: user }, (err, account) => {
        if(err) throw err;
        //태그를 카운트 높은 순서로 정렬
        var tags=account.prefertags
        var sortingField = "count";

        tags.sort(function(a, b) { // 내림차순
            return b[sortingField]-a[sortingField];
        });
        if(tags[0].count==0){
            session.mypage_userinfo={
                _id: account._id,
                userid: account.userid,
                thumbnail:account.profile.thumbnail,
                name:account.profile.name,
                address:account.address,
                introduce:account.profile.introduce,
            };
        }else{
            session.mypage_userinfo={
                _id: account._id,
                userid: account.userid,
                thumbnail:account.profile.thumbnail,
                name:account.profile.name,
                address:account.address,
                introduce:account.profile.introduce,
                prefertags:tags.slice(0,3) //상위 태그 3개
            };
        }
    });
    Evaluation.find({}, (err, evaluation) => {
        for (var i = 0; i < evaluation.length; i++) {
            var eval = {
                transaction_id: evaluation[i].transaction_id,
                evaluator: evaluation[i].evaluator,
                grade: evaluation[i].evaluation_grade,
                comment: evaluation[i].comment
            }
            evaluation_list.push(eval);
        }
    });
    Product.find({},(err,product)=>{
        for(var i=0;i<product.length;i++){
            var item={
                product_name:product[i].product_name,
                product_id:product[i]._id,
                thumbnail:product[i].thumbnail
            }
            thumbnail_list.push(item)
        }
    });
    
    //거래 목록 중 구매 목록
    Transaction.find({ $or: [{ purchaser: user }, { sellers: user }] }, (err, list) => { //Model.findOne 메소드
        if (err) throw err;
        let purchase_list = [];
        let sale_list = [];
        for (var i = 0; i < list.length; i++) {
            if (list[i].purchaser == user) {
                let thumbnail;
                let product_id;
                let total_price = list[i].transaction_quantity * list[i].transaction_price;
                for(var j=0;j<thumbnail_list.length;j++){
                    if(list[i].product_name==thumbnail_list[j].product_name){
                        thumbnail=thumbnail_list[j].thumbnail;
                        product_id=thumbnail_list[j].product_id;
                    }

                }
                var data = {
                    _id: list[i]._id,
                    product_name: list[i].product_name,
                    product_id:product_id,
                    thumbnail:thumbnail,
                    purchaser: list[i].purchaser,
                    sellers: list[i].sellers,
                    total_price: total_price,
                    transaction_status: list[i].transaction_status,
                    transaction_strart_date: list[i].transaction_strart_date,
                    transaction_end_date: list[i].transaction_end_date
                }
                purchase_list.push(data)
            } else if (list[i].sellers == user) { //판매자랑 유저랑 비교
                for(var j=0;j<thumbnail_list.length;j++){
                    if(list[i].product_name==thumbnail_list[j].product_name){
                        thumbnail=thumbnail_list[j].thumbnail;
                        product_id=thumbnail_list[j].product_id;
                    }
                }
                if (list[i].transaction_status == "평가완료") { //평가가 안료된 상품이 있으면
                    for (var j = 0; j < evaluation_list.length; j++) {
                        if (list[i]._id.equals(evaluation_list[j].transaction_id)) {
                            var data = {
                                _id: list[i]._id,
                                product_name: list[i].product_name,
                                product_id:product_id,
                                thumbnail:thumbnail,
                                purchaser: list[i].purchaser,
                                sellers: list[i].sellers,
                                transaction_status: list[i].transaction_status,
                                transaction_strart_date: list[i].transaction_strart_date,
                                delivery_date: list[i].delivery_date,
                                transaction_end_date: list[i].transaction_end_date,
                                evaluator: evaluation_list[j].evaluator,
                                grade: evaluation_list[j].grade,
                                comment: evaluation_list[j].comment
                            }
                            sale_list.push(data);
                        }
                    }
                } else { //평가 완료된 상품이 없으면
                    var data = {
                        _id: list[i]._id,
                        product_name: list[i].product_name,
                        product_id:product_id,
                        thumbnail:thumbnail,
                        purchaser: list[i].purchaser,
                        sellers: list[i].sellers,
                        transaction_status: list[i].transaction_status,
                        transaction_strart_date: list[i].transaction_strart_date,
                        delivery_date:list[i].delivery_date,
                        transaction_end_date: list[i].transaction_end_date,
                    }
                    sale_list.push(data);
                }
            }
        }
        session.purchaseList = {
            purchase_list: purchase_list
        }
        session.saleList = {
            sale_list: sale_list
        }
        Purchase.find({sponsor: {$elemMatch: {user: userObjId}}}).populate('writer').exec(function(err, purchaseList){
            if(err)
                console.log(err);
            console.log('asasasasasasasasasas: ' + purchaseList)
            Purchase.find({writer: userObjId}).populate(['writer', 'sponsor.user']).exec(function(err1, purchaseUserList){
                if(err1)
                    console.log(err1);
                console.log('qwqwqwqwqwqw : ' + purchaseUserList);
                Design.find({writer: userObjId}).populate(['writer', 'sponsor.user']).exec(function(err1, designList){
                    if(err1)
                        console.log(err1);
                    console.log('121231 : ' + designList);
                    return res.render("mypage", { session: session, moment: moment,designList: designList, purchaseResult: purchaseList, purchaseUserList: purchaseUserList });
                });
            });
        });
        //return res.render("mypage", { session: session, moment: moment });
    });
});

router.post('/update', upload.single('update_img'),function(req,res){
    let session=req.session;
    if (!session.loginInfo) {
        return res.render('login', { session: session });
    }

    Account.findOne({ _id: session.loginInfo._id }, (err, account) => {
        var update_img,update_introduce
        var update_addr=req.body.update_addr
        if(req.body.update_pw){
            hasher({password:req.body.update_pw, salt : account.salt},(err,pass,salt,hash)=>{
                Account.update({_id: session.loginInfo._id },{password:hash}, function (err, result) {
                });
            });
        }else{
            Account.update({_id: session.loginInfo._id },{password:account.password}, function (err, result) {
            });
        }if(req.file){
            var fname= req.file.originalname.replace(" ", "")
            update_img="../public/images/" + req.session.loginInfo.userid + fname
        }else{
            update_img=account.profile.thumbnail
        }
        if(req.body.introduce){
            update_introduce=req.body.introduce
        }else{
            update_introduce=account.profile.introduce
        }
        Account.updateMany({_id: session.loginInfo._id },{profile:{thumbnail:update_img,name:account.profile.name,introduce:update_introduce},address:update_addr}, function (err, result) {
            res.redirect('/mypage')
        });
    });

});

module.exports = router;