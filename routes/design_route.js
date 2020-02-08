var express = require('express');
let session=require('express-session');
var router = express.Router();
var Design = require('../models/Design');
const Purchase = require('../models/Purchase').Purchase;
const multer=require('multer');
var moment = require('moment');


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


/* GET home page. */
router.get('/', function(req, res, next) {

    let session=req.session;
    if(!session.loginInfo){
        return res.render('login',{session:session});
    }

    var nowDate = new Date();

    Design.find({endDate: {$gte: nowDate}}).populate('writer').exec( function (err, result) {
        console.log(result);
        res.render('design/design_list', {posts: result, session: session});
    });
});

//도안평가 글 생성페이지
router.get('/design_create', function(req, res, next) {
   let session=req.session;
    if(!session.loginInfo){
        return res.render('login',{session:session});
    }
   
    res.render('design/design_create', {session:session});
});
//도안평가 글 생성
router.post('/design_create', upload.single('image'), function(req, res, next) {
     let session=req.session;
     if(!session.loginInfo){
         return res.render('login',{session:session});
     }
     var tag=[];
     for(var i=0;i<req.body.tag.length;i++){
         tag.push(req.body.tag[i]);
     }
     var accountObjId =req.session.loginInfo._id;//작성자 오브젝트 객체 아이디
    var title =req.body.title;
    var prediction_price =req.body.prediction_price;
    var kinds =req.body.kinds;
    
     
    var contents = req.body.contents;
    console.log(req.file);
    var nowDate = new Date();
    var nowYear = nowDate.getFullYear();
    var nowMonth = nowDate.getMonth();
    var nowDay = nowDate.getDate();
    var nowDate = new Date(nowYear, nowMonth, nowDay);
    console.log(nowDate);

    Design.create({
        writer:accountObjId,
        image:"/public/images/"+req.file.filename,
        title :title,
        prediction_price :prediction_price,
        kinds :kinds,
        tag :tag,
        contents :contents,
        endDate :nowDate.setMonth(nowMonth + 1)
    });
    res.redirect('/design');
     
 });

 router.get('/detail/:objectId', function(req, res, next) {
    let session=req.session;
    if(!session.loginInfo){
        return res.render('login',{session:session});
    }

    var objectId = req.params.objectId;

    Design.find({_id:objectId}).populate(['writer', 'comments.writer']).exec( function (err, result) {
        if(err){
            console.log(err);
        }else{
            var likeUsers = result[0].like;
            var count = 0;

            likeUsers.forEach(element => {
                if(element.user == session.loginInfo._id){
                    count++;
                }
            });
            /*
            var comments = result[0].comments
            comments.forEach(function(commentObj){
                commentObj.content = commentObj.content.replace(/(?:\r\n|\r|\n)/g, '<br>')
            });

            result.comments = comments;
            */
            res.render('design/design_detail', {posts: result, session: session, like:count, moment});
        }
    });
});

router.post('/like', function(req, res, next) {

    let session=req.session;
    if(!session.loginInfo){
        return res.render('login',{session:session});
    }
    
    var likeObj = { user:session.loginInfo._id};
    console.log('likeObj : ' + likeObj);
    Design.find({_id:req.body.post, like:{ $elemMatch: { user: session.loginInfo._id }}}, function(err, result) {
        console.log('result : ' + result);
        if(err){
            console.log(err);
        }else{
            if(result.length == 1){
                Design.update({_id:req.body.post},{$pull:{like: {"user": session.loginInfo._id}}}, function(err, design){
                    if (err){
                        console.log(err);
                    }else{
                        console.log("---------------성공");
            
                        Design.findOne({_id:req.body.post}, function(err, result){
                            if(err)
                                console.log(err);
                            else{
                                res.json({'success': true, 'likeCount': result.like.length});
                            }
                        });
                    }
                });
            }else{
                Design.update({_id:req.body.post},{$push:{like:likeObj}}, function(err, design){
                    if (err){
                        console.log(err);
                    }else{
                        console.log("---------------성공");
            
                        Design.findOne({_id:req.body.post}, function(err, result){
                            if(err)
                                console.log(err);
                            else{
                                res.json({'success': true, 'likeCount': result.like.length});
                            }
                        });
                    }
                });
            }
        }
    });
});

//modify
router.post('/modify', function(req, res, next) {

    let session=req.session;
    if(!session.loginInfo){
        return res.render('login',{session:session});
    }
    var designId = req.body.designId;
    Design.find({_id:designId}).populate('writer').exec( function (err, result) {
        console.log(result);
        res.render('design/design_modify', {posts: result, session: session});
    });
});

router.post('/modify_ok', function(req, res, next) {
    let session=req.session;
    if(!session.loginInfo){
        return res.render('login',{session:session});
    }
    var designId = req.body.designId;
    console.log('designId: ' + designId);
    var designTitel = req.body.title;
    console.log('designTitle: ' + designTitel);
    var designPrice = req.body.prediction_price;
    console.log('designPrice : ' + designPrice);
    var designContents = req.body.contents;
    console.log('designContents : ' + designContents);

    Design.update({_id:designId},{title:designTitel, prediction_price:designPrice, contents:designContents}, function (err, result) {
        console.log(result);
        res.redirect('/design');
    });
});


router.post('/delete', function(req, res, next) {
    let session=req.session;
    if(!session.loginInfo){
        return res.render('login',{session:session});
    }
    var designId = req.body.designId;
    console.log('designId: ' + designId);
    Design.remove({_id:designId}, function (err, result) {
        console.log(result);
        res.redirect('/design');
    });
});

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
        Design.find({endDate: {$gte: nowDate}, title:{$regex:title}, kinds: {$in:kindList}}).populate('writer').exec( function (err, result) {
            console.log(result);
            res.json({'success': true, 'posts': result});
        });
    else
        Design.find({endDate: {$gte: nowDate}, title:{$regex:title}}).populate('writer').exec( function (err, result) {
            console.log(result);
            res.json({'success': true, 'posts': result});
        });
});
router.post('/deleteComment', function (req, res, next) {
    let session=req.session;
    if(!session.loginInfo){
        return res.render('login',{session:session});
    }
    var designId= req.body.designId;
    var commentId = req.body.commentId;
  
     Design.update({_id: designId}, {$pull:{comments: {"_id": commentId}}}, function (err, result) {
        Design.find({_id: designId}).populate('comments.writer').exec(function(err, result){
            console.log('asdfasdfasdfasdf: ' + result);
            res.json({'designObj': result});
        })
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
    Design.update({_id: designId}, {$push:{comments:commentObj}}, function (err, result) {
        Design.find({_id: designId}).populate('comments.writer').exec(function(err, result){
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

    Design.update({'_id':designId, 'comments._id': commentId},{'$set':{'comments.$.content': content}},function (err, result) {
        if(err)
            console.log('errrrrrrrrrrrrrrrrr : ' + err);
        else
            Design.find({_id: designId}).populate('comments.writer').exec(function(err2, result){
                if(err2)
                    console.log('errrrrrrrr2 : ' + err2);
                else
                    res.json({'designObj': result});
            });
   });
});
/*
router.post('/modifyOk', function(req, res, next) {
    console.log('modifyOk');

    let session=req.session;
    if(!session.loginInfo){
        return res.render('login',{session:session});
    }
    var designId = req.body.designId;
    console.log('designId: ' + designId);
    var designTitel = req.body.title;
    console.log('designTitle: ' + designTitel);
    var designPrice = req.body.prediction_price;
    console.log('designPrice : ' + designPrice);
    var designContents = req.body.contents;
    console.log('designContents : ' + designContents);

    Design.update({_id:designId},{title:designTitel, prediction_price:designPrice, contents:designContents}, function (err, result) {
        console.log(result);
        res.redirect('/design');
    });
});
*/
//댓글 삭제기능 modifyComment

module.exports = router;
