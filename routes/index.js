var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var Product = require('../models/product');
var Order = require('../models/order');


/* GET home page. */
router.get('/', function(req, res, next) {
  Product.find(function (err, docs) {
    var productChunks = [];
    var chunkSize = 3;
    for(var i = 0; i < docs.length; i += chunkSize){
      productChunks.push(docs.slice(i, i + chunkSize));
    }
      res.render('shop/index', { title: 'Shoping',products:productChunks});
  });
});

router.get('/add-to-cart/:id',function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    Product.findById(productId, function (err, product) {
       if(err){
         return res.redirect('/');
       }
       cart.add(product, product.id);
       req.session.cart = cart;
       console.log(req.session.cart);
       res.redirect('/');
    });
});

router.get('/add-to-cart-again/:id',function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    Product.findById(productId, function (err, product) {
        if(err){
            return res.redirect('/');
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.render('./shop/shopping-cart',{products:cart.generateArray(), totalPrice : cart.totalPrice});
    });
});

router.get('/remove-from-cart/:id',function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    Product.findById(productId, function (err, product) {
        if(err){
            return res.redirect('/');
        }
        cart.removeItem(product, product.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.render('./shop/shopping-cart',{products:cart.generateArray(), totalPrice : cart.totalPrice});
    });
});

router.post('/user/delete-from-cart', function (req, res, next) {

});

router.get('/shopping-cart',function (req, res, next) {
   if(!req.session.cart){
     return res.render('./shop/shopping-cart',{products:null});
   }
   var cart = new Cart(req.session.cart);
   res.render('./shop/shopping-cart',{products:cart.generateArray(), totalPrice : cart.totalPrice,imagePath: Product.imagePath});
});

router.get('/checkout',function (req, res, next) {
    if(!req.session.cart){
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    res.render('./shop/checkout',{total: cart.totalPrice, errMsg:errMsg, noError: !errMsg});
});

router.post('/checkout', function (req, res, next) {
    if(!req.session.cart){
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
  /*  var stripe = require("stripe")(
        "sk_test_WVqjy55h1IQ56y31Kav9iVsX"
    );
*/

/*    stripe.charges.create({
        amount: cart.totalPrice*100,
        currency: "usd",
        source: req.body.stripeToken, // obtained with Stripe.js
        description: "Test Charge"
    }, function(err, charge) {
        if(err){
            req.flash('error', err.message);
            return res.redirect('/checkout');
        }*/

        var order = new Order({
            user:req.user,
            cart:cart,
            name:req.body.name,
            address:req.body.address,
            paymentID:'56666666666666ggg'
        });
        console.log(order);
        order.save(function (err, result) {
            console.log(result+'================');
            req.flash('success', 'Successful bought product');
            req.session.cart = null;
            res.redirect('/');
        });
    //});
});



router.post('/search', function (req, res, next) {
    var text = req.body.text;
    Product.find({title:{$regex:'^(.*?('+text+')[^$]*)$'}}, function (err, data) {
    if(err){
        res.render('./shop/index', {message:'item not found'});
    }
    else{
        console.log(data + data.length);
        res.render('./shop/index',{message:'item found', products:data});
    }
   });
});


router.post('/filter',function (req, res, next) {
   var items = req.body;
   //{$or: [ { category:{$regex:'^(.*?('+items.category+')[^$]*)$'}}, {price: { $range: [ items.qmin, "$price", items.qmax ] }}  ]}
   Product.find({category:{$regex:'^(.*?('+items.category+')[^$]*)$'}}, function (err, data) {
       if(err){
           res.redirect('/');
       }
       else{
           console.log(data+'=================================DATA=================================');
           res.render('./shop/index', {products:data});
       }
   });
});

module.exports = router;
