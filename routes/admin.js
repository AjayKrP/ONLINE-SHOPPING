'use strict';
var express = require('express');
var router = express.Router();
var Products = require('../models/product');
var mongoose = require('mongoose');
var multer = require('multer');
var path = require('path');
var nodemailer = require("nodemailer");
var ObjectId = require('mongodb').ObjectId;
var user = require('./user');
var os = require('os');
var ifaces = os.networkInterfaces();

require('./user');
mongoose.connect('localhost:27017/shopping');

var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "kajay5080@gmail.com",
        pass: "gmail@ajay"
    }
});

var rand,mailOptions,host,link;

router.get('/send',function(req,res){
    rand=Math.floor((Math.random() * 100) + 54);
    host=ifaces.address;
    link="http://"+ifaces.address+':3000/admin'+"/verify?id="+rand;
    mailOptions={
        to : req.body.email,
        subject : "Please confirm your Email account",
        html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
    };
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
            res.send('error');
        }else{
            console.log("Message sent: " + response.message);
            res.redirect('/');
        }
    });
});

router.get('/verify',function(req,res){
    console.log(req.protocol+":/"+req.get('host'));
    if((req.protocol+"://"+ifaces.address)=== ifaces.address) {
        console.log("Domain is matched. Information is from Authentic email");
        if(req.query.id==rand) {
            console.log("email is verified");
            res.end("<h1>Email "+mailOptions.to+" is been Successfully verified");
        }
        else {
            console.log("email is not verified");
            res.end("<h1>Bad Request</h1>");
        }
    }
    else
    {
        res.end("<h1>Request is from unknown source");
    }
});

var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        console.log(file);
        callback(null, './public/images');
    },
    filename: function(req, file, callback) {
        callback(null, file.originalname );
    }
});

var upload = multer({
    storage: storage,
    fileFilter: function(req, file, callback) {
        var ext = path.extname(file.originalname)
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(res.end('Only images are allowed'), null);
        }
        callback(null, true);
    }
});

router.get('/create', function (req, res, next) {
    res.render('admin/create') ;
});


router.post('user/delete-item-from-cart/:id', function (req, res, next) {
    var items = req.params.id;
    Products.find({_id:items}, function (err, data) {

    });
});


router.get('/main', function (req, res, next) {
   res.render('admin/main');
});

router.post('/create',upload.single('file'), function (req, res, next) {
    var items = req.body;
     console.log(req.file.originalname);
     console.log(items);
    Products.find({'imagePath': '/images/'+req.file.originalname, 'title':items.title},function (err, data) {
            var products =
                new Products({
                    imagePath: '/images/'+req.file.originalname,
                    title: items.title,
                    description:items.description,
                    quantity:items.quantity,
                    category:items.category,
                    price:items.price
                });

            products.save(function (err, result) {
                console.log('save()');
                if(err) throw err;
                res.redirect('/');
            });
    });
});

router.get('/delete', function (req, res, next) {
    Products.find(function (err, data) {
        res.render('admin/product-manager',{ products:data});
    });
});

router.get('/delete/:id', function (req, res, next) {
    var productID = req.params.id;
    Products.remove({_id: new ObjectId(req.params.id)}, function (err) {
      if(err) {
          res.json(err);
      }
      else {
          res.redirect('/admin/delete');
      }
  });
});


module.exports = router;