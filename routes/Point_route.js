var express = require('express');
let session=require('express-session');
var router = express.Router();
var Account = require("../models/Account");

/* GET home page. */
router.get('/', function(req, res, next) {
    let session=req.session;
    if(!session.loginInfo){
        return res.render('login',{session:session});
    }

    res.render('point', {session:session});
});

router.post('/up', function (req, res, next) {
    var accountObjId =req.session.loginInfo._id;
    var price = parseInt(req.body['price']);
    console.log(price);
    Account.findOne({_id: accountObjId}, async function (err, userInfo) {
        await Account.where({_id: accountObjId})
            .update({point: userInfo.point + price})
            .exec();
    });
    var point=req.session.loginInfo.point
    var addpoint=point+price
    console.log(addpoint)
    req.session.loginInfo.point=addpoint;
    console.log("point router"+req.session.loginInfo.point)
    res.redirect('/main');
});

module.exports = router;
