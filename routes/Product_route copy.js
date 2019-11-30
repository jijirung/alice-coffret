const express = require('express');
const voca = require('voca')
let session = require('express-session');
const multer = require('multer');

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

const Product = require('../models/Product');
const router = express.Router();

//판매글 목록.sort('-createdAt').limit(4).exec(
router.get('/sale_list', function (req, res) {
    let session = req.session;
    if (!session.loginInfo) {
        return res.render('login', { session: session });
    }
    Product.find({}).sort('-createdAt').exec(function (err, product) { //Model.findOne 메소드
        if (err) throw err;

        let list1 = []
        let list2 = []
        let list3 = []
        let list4 = []
        for (var i = 0; i < product.length; i++) {
            var data = {
                _id: product[i]._id,
                product_name: product[i].product_name,
                userid: product[i].userid,
                name: product[i].name,
                category: product[i].category,
                content: product[i].content,
                product_quantity: product[i].product_quantity,
                price: product[i].price,
                thumbnail: product[i].thumbnail,
                tag: product[i].tag,
                recent_product: product[i].recent_product,
                createdAt: product[i].createdAt
            }
            list1.push(data)
        }
        for (var i = 0; i < product.length; i++) {
            if (product[i].category == "Earring") {
                var data = {
                    _id: product[i]._id,
                    product_name: product[i].product_name,
                    userid: product[i].userid,
                    name: product[i].name,
                    category: product[i].category,
                    content: product[i].content,
                    product_quantity: product[i].product_quantity,
                    price: product[i].price,
                    thumbnail: product[i].thumbnail,
                    tag: product[i].tag,
                    recent_product: product[i].recent_product,
                    createdAt: product[i].createdAt
                }
                list2.push(data)
            } else if (product[i].category == "Ring") {
                var data = {
                    _id: product[i]._id,
                    product_name: product[i].product_name,
                    userid: product[i].userid,
                    name: product[i].name,
                    category: product[i].category,
                    content: product[i].content,
                    product_quantity: product[i].product_quantity,
                    price: product[i].price,
                    thumbnail: product[i].thumbnail,
                    tag: product[i].tag,
                    recent_product: product[i].recent_product,
                    createdAt: product[i].createdAt
                }
                list3.push(data)
            }
        }
        session.productInfo = {
            all_list: list1,
            earring_list: list2,
            ring_list: list3
        } 
        return res.render('sale_list', { session: session });
    });
});


//판매글 작성
router.post('/sale_post', upload.single('imgfile'), function (req, res) {
    let session = req.session;
    if (!session.loginInfo) {
        return res.render('login', { session: session });
    }
    var tag = [];
    for (var i = 0; i < req.body.tag.length; i++) {
        tag.push(req.body.tag[i])
    }
    if (!req.file) {
        var product = new Product({
            userid: req.session.loginInfo.userid,
            product_name: req.body.product_name,
            name: req.session.loginInfo.name,
            category: req.body.accessory_category,
            content: req.body.post_content,
            product_quantity: req.body.product_quantity,
            price: req.body.price,
            tag: tag
        });
    } else {
        var fname = req.file.originalname.replace(" ", "")
        var product = new Product({
            userid: req.session.loginInfo.userid,
            product_name: req.body.product_name,
            name: req.session.loginInfo.name,
            category: req.body.accessory_category,
            content: req.body.post_content,
            product_quantity: req.body.product_quantity,
            price: req.body.price,
            thumbnail: "../public/images/" + req.session.loginInfo.userid + fname,
            tag: tag
        })
    }
    product.save(err => {
        if (err) throw err;

        return res.render('main', { session: session });
    });

});

//판매글 상세
router.get('/detail', function (req, res) {
    let session = req.session;
    if (!session.loginInfo) {
        return res.render('login', { session: session });
    }
    let productid = req.query.productId;

    Product.findOne({ _id: productid }, (err, product) => { //Model.findOne 메소드
        if (err) throw err;
        var content = voca.replaceAll(product.content, "\n", "<br/>")
        content = voca.replaceAll(content, "<script", "&lt;script")
        var data = {
            _id: product._id,
            product_name: product.product_name,
            userid: product.userid,
            name: product.name,
            content: content,
            product_quantity: product.product_quantity,
            price: product.price,
            thumbnail: product.thumbnail,
            tag: product.tag,
            recent_product: product.recent_product,
            createdAt: product.createdAt,
            loginid: req.session.loginInfo.userid
        }
        session.productDetail = {
            data: data
        }
        return res.render('sale_detail', { session: session });
    });

});

//판매글 수정
router.post('/update', function (req, res) {
    session = req.session;
    let product_id = req.session.productDetail.data._id;

    Product.findByIdAndUpdate({ _id: product_id }, req.body, function (err, product) {
        if (err) return res.json(err);
        res.render("sale_list", { session: session });
    })
})

//판매글 삭제
router.get('/delete', function (req, res) {
    session = req.session;
    let product_id = req.query.productId;

    Product.deleteOne({ _id: product_id }, function (err) {
        if (err) return res.json(err);
        res.render("main", { session: session });
    });
})

module.exports = router;

