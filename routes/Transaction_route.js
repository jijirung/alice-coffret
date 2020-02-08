const express = require('express');
const router = express.Router();
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

const Account = require('../models/Account');
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const Evaluation = require("../models/Evaluation");

// smtpPool는 smtp서버를 사용하기 위한 모듈로
// transporter객체를 만드는 nodemailer의 createTransport메소드의 인자로 사용된다.
const nodemailer = require('nodemailer');
const smtpPool = require('nodemailer-smtp-pool');

const config = {
    mailer: {
        service: 'Naver',
        host: 'localhost',
        port: '465',
        user: 'email@naver.com', //email
        password: 'paa#3ffd', //password
    },
};

router.post('/purchase', function (req, res) {
    let quantity = req.body.sale_quantity;
    let update_quantity;
    let price = quantity * req.session.productDetail.data.price;
    let purchase_user = req.session.loginInfo.userid;
    let sale_user = req.session.productDetail.data.userid;
    let product_id = req.session.productDetail.data._id;
    let origin_point = req.session.loginInfo.point;
    let point = origin_point - price 
    var tags=req.session.productDetail.data.tag
    if (!req.session.loginInfo) {
        return res.render('login', { session: req.session });
    }
    Product.findOne({ _id: product_id }, (err, product) => {
        update_quantity = product.product_quantity - quantity;
    });

    Account.findOne({ userid: purchase_user }, (err, account) => { 
        var sp_num,sum_num,fal_num,win_num,cu_num,blil_num,lux_num,sim_num

        if (err) throw err;

        if (account.point < price) {
            req.session.point_status = false;
            return res.render('point', { session: req.session })
        }
        
        //구매시 태그 카운트 증가(선호 태그 조사용)
        for(var i=0;i<account.prefertags.length;i++){
            if(account.prefertags[i].tagName=="spring"){
                sp_num=account.prefertags[i].count
            }else if(account.prefertags[i].tagName=="summer"){
                sum_num=account.prefertags[i].count
            }
            else if(account.prefertags[i].tagName=="fall"){
                fal_num=account.prefertags[i].count
            }
            else if(account.prefertags[i].tagName=="winter"){
                win_num=account.prefertags[i].count
                
            }
            else if(account.prefertags[i].tagName=="cute"){
                cu_num=account.prefertags[i].count
                
            }
            else if(account.prefertags[i].tagName=="brilliant"){
                blil_num=account.prefertags[i].count
                
            }
            else if(account.prefertags[i].tagName=="luxury"){
                lux_num=account.prefertags[i].count
                
            }
            else if(account.prefertags[i].tagName=="simple"){
                sim_num=account.prefertags[i].count
                
            }
        }
        for(var i=0;i<tags.length;i++){
            if(tags[i]=="봄"){
                sp_num+=(1*quantity)
                Account.update({_id: account._id, "prefertags.tagName":"spring"},{"$set":{"prefertags.$.count":sp_num}}, function (err, result) {
                    if (err) throw err;

                });
                
            }else  if(tags[i]=="여름"){
                sum_num+=(1*quantity)
                Account.update({_id: account._id, "prefertags.tagName":"summer"},{"$set":{"prefertags.$.count":sum_num}}, function (err, result) {
                    if (err) throw err;

                });
            }
            else  if(tags[i]=="가을"){
                fal_num+=(1*quantity)
                Account.update({_id: account._id, "prefertags.tagName":"fall"},{"$set":{"prefertags.$.count":fal_num}}, function (err, result) {
                    if (err) throw err;

                });
            }
            else if(tags[i]=="겨울"){
                win_num=win_num+(1*quantity)
                Account.update({_id: account._id, "prefertags.tagName":"winter"},{"$set":{"prefertags.$.count":win_num}}, function (err, result) {
                    if (err) throw err;

                });
            }
            else if(tags[i]=="큐트"){
                cu_num=cu_num+(1*quantity)
                Account.update({_id: account._id, "prefertags.tagName":"cute"},{"$set":{"prefertags.$.count":cu_num}}, function (err, result) {
                    if (err) throw err;

                });
            }
            else if(tags[i]=="우아"){
                blil_num=blil_num+(1*quantity)
                Account.update({_id: account._id, "prefertags.tagName":"brilliant"},{"$set":{"prefertags.$.count":blil_num}}, function (err, result) {
                    if (err) throw err;

                });
            }
            else if(tags[i]=="화려"){
                lux_num=lux_num+(1*quantity)
                Account.update({_id: account._id, "prefertags.tagName":"luxury"},{"$set":{"prefertags.$.count":lux_num}}, function (err, result) {
                    if (err) throw err;

                });
            }
            else if(tags[i]=="심플"){
                sim_num=sim_num+(1*quantity)
                Account.update({_id: account._id, "prefertags.tagName":"simple"},{"$set":{"prefertags.$.count":sim_num}}, function (err, result) {
                    if (err) throw err;

                });
            }
        }
        Product.updateOne({ _id: product_id }, { product_quantity: update_quantity }, function (err, result) {
            if (err) throw err;

        });
        Account.updateMany({ _id: account._id }, { point: point}, function (err, result) {
            if (err) throw err;

        });
        let transaction = new Transaction({
            product_name: req.session.productDetail.data.product_name,
            purchaser: purchase_user,
            sellers: sale_user,
            transaction_quantity: quantity,
            transaction_price: price,
            transaction_status: "거래중",

        });
        transaction.save(err => {
            if (err) throw err;

            req.session.loginInfo.point = point;
            res.redirect('/main');
        });

    });
    // req.session.loginInfo.point=point;
    // res.redirect('/main'); 

});

//거래 완료 상태로 수정
router.get('/update_transaction', function (req, res) {
    session = req.session;
    let transaction_id = req.query.transactionId;
    let seller,purchaser;
    let seller_name, purchase_name;
    let sellerEmail, purchaserEmail;
    Transaction.findOne({ _id: transaction_id }, (err, results) => {
        seller = results.sellers
        purchaser = results.purchaser

        //판매자 이메일
        Account.findOne({ userid: seller }, (err, account) => {
            sellerEmail = account.email;
            seller_name=account.profile.name;
        });
        //구매자 이메일 
        Account.findOne({ userid: purchaser }, (err, account) => {
            purchaserEmail = account.email;
            purchase_name=account.profile.name;
        });
        Transaction.findOne({ _id: transaction_id }, (err, results) => {
            let date = moment().format('YYYY-MM-DD HH:mm:ss');
            const from = "Alice" + "'" + "s Coffret < " + config.mailer.user + " >";
            const to = purchaserEmail;
            const subject = '[Alice'+"s Coffret] 상품 배송이 시작되었습니다.";
            const html = '안녕하세요 <b>'+ purchase_name+"</b>님^^"+"<br/>"+
                        '주문하신 상품 : '+ results.product_name+"<br/>"+
                        "수량 : "+results.transaction_quantity+"<br/>"+
                        "가격 : "+results.transaction_price+"<br/>"+
                        "배송이 시작 되었습니다.<br/> 배송문의는 <a href='localhost:3000/main'>고객센터</a> 또는 판매자 <b>"+
                        seller_name+"</b>님의 이메일 "+sellerEmail+"으로 보내주십시오.";
            // const text = 'This is just text.';
            const mailOptions = {
                from,
                to,
                subject,
                html,
            };
            const transporter = nodemailer.createTransport(smtpPool({
                service: config.mailer.service,
                host: config.mailer.host,
                port: config.mailer.port,
                auth: {
                    user: config.mailer.user,
                    pass: config.mailer.password,
                },
                tls: {
                    rejectUnauthorize: false,
                },
                maxConnections: 5,
                maxMessages: 10,
            }));
            if (results.transaction_status == "거래중") {
                Transaction.update({ _id: transaction_id }, { transaction_status: "배송중", delivery_date: date }, function (err, result) {
                    if (err) throw err;
                    // 메일을 전송하는 부분
                    transporter.sendMail(mailOptions, (err, res) => {
                        if (err) {
                            console.log('failed... => ', err);
                        } else {
                            console.log('succeed... => ', res);
                        }

                        transporter.close();
                    });

                });
            } else if (results.transaction_status == "배송중") {
                Transaction.update({ _id: transaction_id }, { transaction_status: "거래완료", transaction_end_date: date }, function (err, result) {
                    if (err) throw err;

                });
            }
        })
    });
    res.redirect('/mypage')
});

//평가 완료 상태로 만들기 위해 평가 결과 계산
router.post('/evaluation', function (req, res) {
    session = req.session;
    totalScore = (parseInt(req.body['score1']) + parseInt(req.body['score2']) + parseInt(req.body['score3'])) / 3;
    let grade;
    if (totalScore >= 3) {
        grade = "A"
    } else if (totalScore >= 2) {
        grade = "B"
    } else if (totalScore >= 1) {
        grade = "C"
    } else {
        grade = "F"
    }
    comment = req.body.comment;

    Transaction.findOne({ _id: session.evaluationId }, (err, transaction) => { //Model.findOne 메소드
        Account.update({ userid: transaction.sellers }, { score: totalScore }, function (err, result) {
            if (err) throw err;
        });
        transaction.transaction_status = "평가완료"
        transaction.save(err => {
            if (err) throw err;
        });

        let evaluation = new Evaluation({
            evaluator: session.loginInfo.userid,
            seller: transaction.sellers,
            evaluation_grade: grade,
            transaction_id: transaction._id,
            comment: comment,
        });

        evaluation.save(err => {
            if (err) throw err;

        });

    });
    res.redirect('/mypage');
})


module.exports = router;