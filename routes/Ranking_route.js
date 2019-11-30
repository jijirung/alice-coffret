const express = require('express');
const router = express.Router();
const moment = require('moment');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const Evaluation = require('../models/Evaluation');
const Product = require("../models/Product");

router.get('/', function (req, res) {
    session = req.session;
    var userList=[]
    Account.find({}).sort({'score':-1}).exec(function (err, account) {
        for (var i = 0; i < account.length; i++) {
            var tags = account[i].prefertags
            var sortingField = "count";
            
            tags.sort(function (a, b) { // 내림차순
                return b[sortingField] - a[sortingField];
            });
            var data = {
                _id: account[i]._id,
                userid: account[i].userid,
                thumbnail: account[i].profile.thumbnail,
                name: account[i].profile.name,
                score:account[i].score,
                prefertags: tags.slice(0, 3) //상위 태그 3개
            }
            userList.push(data)
        }
        session.ranking_list={
            list:userList
        }
        res.render('ranking', { session: session,rankingList:userList });
    });


});

module.exports = router;