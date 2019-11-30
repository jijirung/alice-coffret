var express = require('express');
let session=require('express-session');
var router = express.Router();
var Design = require('../models/Design');
const Purchase = require('../models/Purchase').Purchase;
const Account =require('../models/Account');
const multer=require('multer');

//mail
var nodemailer = require('nodemailer');
var smtpPool=require('nodemailer-smtp-pool');

//schedule
var schedule = require('node-schedule');


const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/images/');
        },
        filename: function (req, file, cb) {
            cb(null, new Date().valueOf() + file.originalname);
        }
    }),
});

//베스트도안 글목록
router.get('/', function(req, res, next) {

    let session=req.session;
    if(!session.loginInfo){
        return res.render('login',{session:session});
    }

    var nowDate = new Date();

    Purchase.find({endDate: {$gte: nowDate}}).populate('writer').exec( function (err, result) {
        console.log(result);
        res.render('purchase/purchase_list', {posts: result, session: session});
    });
});

//생성시 보여줄 페이지
router.post('/create', function(req, res, next){
    let session=req.session;
    if(!session.loginInfo){
        return res.render('login',{session:session});
    }
    var designId = req.body.designId;
    Design.find({_id:designId}).populate('writer').exec( function (err, result) {
        console.log(result);
        res.render('purchase/purchase_create', {posts: result, session: session});
    });


});

//생성작업하는 백엔드
router.post('/create_complete', function(req, res, next) {

    let session=req.session;
    if(!session.loginInfo){
        return res.render('login',{session:session});

    }


    var accountObjId =req.session.loginInfo._id;
    var title = req.body.title;
    var price = req.body.price;
    var goal = req.body.goal;
    var designId = req.body.designId;

    Design.findOne({_id:designId}).populate('writer').exec( function (err, result) {
        if(err){
            console.log(err);
        }else{
            var nowDate = new Date();
            var nowYear = nowDate.getFullYear();
            var nowMonth = nowDate.getMonth();
            var nowDay = nowDate.getDate();
            var nowDate = new Date(nowYear, nowMonth, nowDay);
            console.log(nowDate);

            Purchase.create({
                title:title,
                writer:accountObjId,
                goal:goal,
                price:price,
                image:result.image,
                contents:result.contents,
                tag:result.tag,
                kinds:result.kinds,
                endDate :nowDate.setMonth(nowMonth + 1)
            });
            console.log("-----------------------------------");
            console.log(designId);
            Design.remove({_id:designId}, function(err) {
                res.redirect('/purchase');
            });
        }
    });
});

//글 상세보기
router.get('/detail/:objectId', function(req, res, next) {
    let session=req.session;
    if(!session.loginInfo){
        return res.render('login',{session:session});
    }

    var objectId = req.params.objectId;

    Purchase.find({_id:objectId}).populate(['writer', 'comments.writer']).exec( function (err, result) {
        if(err){
            console.log(err);
        }else{
            console.log(result);
            var purchaseUsers = result[0].sponsor;
            var count = 0;

            purchaseUsers.forEach(element => {
                if(element.user == session.loginInfo._id){
                    count++;
                }
            });

            res.render('purchase/purchase_detail', {posts: result, session: session, purchase:count});
        }
    });
});

//좋아요기능
router.post('/like', function(req, res, next) {

    let session=req.session;
    if(!session.loginInfo){
        return res.render('login',{session:session});
    }
    console.log('------------------------' );

    
    var purchaseObj = { user:session.loginInfo._id};
    console.log('purchaseObj : ' + purchaseObj);
    Purchase.find({_id:req.body.post, sponsor:{ $elemMatch: { user: session.loginInfo._id }}}, function(err, result) {
        console.log('result : ' + result);
        if(err){
            console.log(err);
        }else{
            if(result.length == 1){
                console.log('취소하기');
                Purchase.update({_id:req.body.post},{$pull:{sponsor: {"user": session.loginInfo._id}}}, function(err, design){
                    if (err){
                        console.log(err);
                    }else{
                        console.log("---------------성공");
            
                        Purchase.findOne({_id:req.body.post}, function(err, result){
                            if(err)
                                console.log(err);
                            else{
                                Account.findOne({_id:session.loginInfo._id}, function (err, accountResult) {
                                    if(err)
                                        console.log(err);
                                    else{
                                        var newpoint = result.price + accountResult.point;
                                        Account.update({_id:session.loginInfo._id}, {point:newpoint}, function (err) {
                                            console.log('price: ' + result.price + ' point: ' + accountResult.point);
                                            if(err)
                                                console.log(err);
                                            else{
                                                session.loginInfo.point = newpoint,
                                                res.json({'success': true, 'purchaseCount': result.sponsor.length, 'point': newpoint});
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }else{
                console.log('좋아요하기');
                Purchase.findOne({_id:req.body.post}, function (err, result) {
                    if(err)
                        console.log(err);
                    else{
                        Account.findOne({_id:session.loginInfo._id}, function (err, accountResult) {
                            if(err)
                                console.log(err);
                            else{
                                console.log('price: ' + result.price + ' point: ' + accountResult.point);
                                if(result.price <= accountResult.point){
                                    var newPoint = accountResult.point - result.price;
                                    Account.update({_id:session.loginInfo._id}, {point:newPoint}, function (err) {
                                        if(err)
                                            console.log(err);
                                        else{
                                            Purchase.update({_id:req.body.post},{$push:{sponsor:purchaseObj}}, function(err){
                                                if (err){
                                                    console.log(err);
                                                }else{
                                                    console.log("---------------성공");

                                                    Purchase.findOne({_id:req.body.post}, function(err, result){
                                                        if(err)
                                                            console.log(err);
                                                        else{
                                                            session.loginInfo.point = newPoint,
                                                            res.json({'success': true, 'purchaseCount': result.sponsor.length, 'point': newPoint});
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }else{
                                    res.json({'success':false, 'reason': 'point'});
                                }
                            }
                        });
                    }
                });
            }
        }
    });
});

//수정하는 페이지 보여주는 기능
router.post('/modify', function(req, res, next) {

    let session=req.session;
    if(!session.loginInfo){
        return res.render('login',{session:session});
    }
    var purchaseId = req.body.purchaseId;
    Purchase.find({_id:purchaseId}).populate('writer').exec( function (err, result) {
        console.log(result);
        res.render('purchase/purchase_modify', {posts: result, session: session});
    });
});

//수정기능
router.post('/modify_ok', function(req, res, next) {
    let session=req.session;
    if(!session.loginInfo){
        return res.render('login',{session:session});
    }
    var purchaseId = req.body.purchaseId;
    console.log('purchaseId: ' + purchaseId);
    var purchaseContents = req.body.contents;
    console.log('purchaseContents : ' + purchaseContents);
    var purchaseTitle = req.body.title;
    console.log('purchaseTitle : ' + purchaseTitle);

    Purchase.update({_id:purchaseId},{contents:purchaseContents, title:purchaseTitle}, function (err, result) {
        console.log(result);
        res.redirect('/purchase');
    });
});

//삭제 기능
router.post('/delete', function(req, res, next) {
    let session=req.session;
    if(!session.loginInfo){
        return res.render('login',{session:session});
    }
    var purchaseId = req.body.purchaseId;
    console.log('purchaseId: ' + purchaseId);
    Purchase.remove({_id:purchaseId}, function (err, result) {
        console.log(result);
        res.redirect('/purchase');
    });
});

router.post('/deleteComment', function (req, res, next) {
    let session=req.session;
    if(!session.loginInfo){
        return res.render('login',{session:session});
    }
    var designId= req.body.designId;
    var commentId = req.body.commentId;
  
     Purchase.update({_id: designId}, {$pull:{comments: {"_id": commentId}}}, function (err, result) {
        Purchase.find({_id: designId}).populate('comments.writer').exec(function(err, result){
            console.log('asdfasdfasdfasdf: ' + result);
            res.json({'designObj': result});
        })
    });
});

router.post('/createComment', function (req, res, next) {
    let session=req.session;
    if(!session.loginInfo){
        return res.render('login',{session:session});
    }
    var accountObjId =req.session.loginInfo._id;
    var designId = req.body.designId;
    var comment = req.body.comment;
    var commentObj = {writer: accountObjId, content: comment};
    Purchase.update({_id: designId}, {$push:{comments:commentObj}}, function (err, result) {
        Purchase.find({_id: designId}).populate('comments.writer').exec(function(err, result){
            res.json({'designObj': result});
        });
        //res.redirect('/design/detail/' + designId);
    });
});

router.post('/modifyComment', function(req, res, next) {
    var designId = req.body.designId;
    var commentId = req.body.commentId;
    var content = req.body.content;

    console.log('aaaaaaaaa ', content);

    Purchase.update({'_id':designId, 'comments._id': commentId},{'$set':{'comments.$.content': content}},function (err, result) {
        if(err)
            console.log('errrrrrrrrrrrrrrrrr : ' + err);
        else
            Purchase.find({_id: designId}).populate('comments.writer').exec(function(err2, result){
                if(err2)
                    console.log('errrrrrrrr2 : ' + err2);
                else
                    res.json({'designObj': result});
            });
   });
});


var unCompleteHtml = '<h4>크라우드펀딩이 실패하였습니다.</h4><div>펀딩에 사용하신 포인트는 환불되었습니다.</div>';
var unCompleteTitle = '크라우드펀딩이 실패하였습니다.';
var completeHtml = '<h4>크라우드펀딩이 성공하였습니다.</h4><div>크라우드펀딩에 대한 자세한 정보는 홈페이지에서 확인하실 수 있습니다.</div>';
var completeTitle = '크라우드펀딩이 성공하였습니다.';

var rule = new schedule.RecurrenceRule();
rule.minute = 58;

//스케쥴 설정 부분
var j = schedule.scheduleJob(rule, function(){
    var nowDate = new Date();
    var nowYear = nowDate.getFullYear();
    var nowMonth = nowDate.getMonth();
    var nowDay = nowDate.getDate();
    var nowDate = new Date(nowYear, nowMonth, nowDay);

    Purchase.find({endDate:nowDate}).populate('sponsor.user').exec(function (err, result) {
        for(var i = 0; i < result.length; i++){
            if(result[i].sponsor.length >= result[i].goal){
                var title = result[i].title + ' 크라우드펀딩이 성공하였습니다.';
                var html = '<h4>' + result[i].title + ' 크라우드펀딩이 성공하였습니다.</h4><div>' + result[i].title + ' 크라우드펀딩에 대한 자세한 정보는 홈페이지에서 확인하실 수 있습니다.</div>';
                for(var j = 0; j < result[i].sponsor.length; j++){
                    sendMail(result[i].sponsor[j].user.email, title, html);
                }
            }else{
                var title = result[i].title + ' 크라우드펀딩이 실패하였습니다.';
                var html = '<h4>' + result[i].title + ' 크라우드펀딩이 실패하였습니다.</h4><div>' + result[i].title + ' 크라우드펀딩에 사용하신 포인트는 환불되었습니다.</div>';
                for(var j = 0; j < result[i].sponsor.length; j++){
                    var newPoint = result[i].sponsor[j].user.point + result[i].price;
                    var userObj = result[i].sponsor[j].user;
                    console.log('_id: ' + userObj._id);
                    Account.update({_id:userObj._id},{point:newPoint}, function(err) {
                        if(err)
                            console.log(err);
                        else{
                            console.log(userObj);
                            console.log(userObj.email);
                            sendMail(userObj.email, title, html);
                        }
                    });
                }
            }
        }
    });
});

//메일 보내는 함수
function sendMail(user, title, html) {

    var smtpTransport=nodemailer.createTransport(smtpPool( {
        service: 'gmail'
        ,prot : 587
        ,host :'smtp.gmlail.com'
        ,secure : false
        ,requireTLS : true
        ,tls:{
            rejectUnauthorize:false
        },

        //이메일 전송을 위해 필요한 인증정보

        //gmail 계정과 암호
        auth:{
            user:'',
            pass:''
        },
        maxConnections:5,
        maxMessages:10
    }) );

    var mailOpt={
        from:'',
        to:user,
        subject:title,
        html:html
    };
    smtpTransport.sendMail(mailOpt, function(err, res) {
        if( err ) {
            console.log(err);
        }else{
            console.log('Message send :'+ res);
        }

        smtpTransport.close();
    });
}


//제목으로 크라우드펀딩 찾기
router.post('/find', function (req, res, next) {
    var title =req.body.title;
    var earringCheck = req.body.earringCheck;
    var piercingCheck = req.body.piercingCheck;
    var ringCheck = req.body.ringCheck;
    var wristbandCheck = req.body.wristbandCheck;
    var necklacetCheck = req.body.necklacetCheck;
    var chokerCheck = req.body.chokerCheck;
    var clockCheck = req.body.clockCheck;
    var broochCheck = req.body.broochCheck;
    var hairclipCheck = req.body.hairclipCheck;
    
    var kindList = []
    if(earringCheck == true)
        kindList.push('Earring');
        
    if(piercingCheck == true)
        kindList.push('Piercing');

    if(ringCheck == true)
        kindList.push('Ring');

    if(wristbandCheck == true)
        kindList.push('Wristband');

    if(necklacetCheck == true)
        kindList.push('Necklace');

    if(chokerCheck == true)
        kindList.push('Choker');

    if(clockCheck == true)
        kindList.push('Clock');

    if(broochCheck == true)
        kindList.push('Brooch');

    if(hairclipCheck == true)
        kindList.push('Hairclip');

    console.log('kindList : ' + kindList);
    var nowDate = new Date();
    if(kindList.length != 0)
        Purchase.find({endDate: {$gte: nowDate}, title:{$regex:title}, kinds: {$in:kindList}}).populate('writer').exec( function (err, result) {
            console.log(result);
            res.json({'success': true, 'posts': result});
        });
    else
        Purchase.find({endDate: {$gte: nowDate}, title:{$regex:title}}).populate('writer').exec( function (err, result) {
            console.log(result);
            res.json({'success': true, 'posts': result});
        });
});

//댓글 추가기능
router.post('/createComment', function (req, res, next) {
    let session=req.session;
    if(!session.loginInfo){
        return res.render('login',{session:session});
    }
    var accountObjId =req.session.loginInfo._id;
    var designId = req.body.designId;
    var comment = req.body.comment;
    var commentObj = {writer: accountObjId, content: comment};
    Purchase.update({_id: designId}, {$push:{comments:commentObj}}, function (err, result) {
        res.redirect('/purchase/detail/' + designId);
    });
});
/*
//제목으로 도안 찾기
router.post('/find', function (req, res, next) {
    var title =req.body.title;
    var earringCheck = req.body.earringCheck;
    var piercingCheck = req.body.piercingCheck;
    var ringCheck = req.body.ringCheck;
    var wristbandCheck = req.body.wristbandCheck;
    var necklacetCheck = req.body.necklacetCheck;
    var chokerCheck = req.body.chokerCheck;
    var clockCheck = req.body.clockCheck;
    var broochCheck = req.body.broochCheck;
    var hairclipCheck = req.body.hairclipCheck;

    var kindList = []
    if(earringCheck == true)
        kindList.push('Earring');
        
    if(piercingCheck == true)
        kindList.push('Piercing');

    if(ringCheck == true)
        kindList.push('Ring');

    if(wristbandCheck == true)
        kindList.push('Wristband');

    if(necklacetCheck == true)
        kindList.push('Necklace');

    if(chokerCheck == true)
        kindList.push('Choker');

    if(clockCheck == true)
        kindList.push('Clock');

    if(broochCheck == true)
        kindList.push('Brooch');

    if(hairclipCheck == true)
        kindList.push('Hairclip');

    console.log('kindList : ' + kindList);
    var nowDate = new Date();
    if(kindList.length != 0)
        Purchase.find({endDate: {$gte: nowDate}, title:{$regex:title}, kinds: {$in:kindList}}).populate('writer').exec( function (err, result) {
            console.log(result);
            res.json({'success': true, 'posts': result});
        });
    else
        Purchase.find({endDate: {$gte: nowDate}, title:{$regex:title}}).populate('writer').exec( function (err, result) {
            console.log(result);
            res.json({'success': true, 'posts': result});
        });
});
*/
module.exports = router;