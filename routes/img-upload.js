var express = require("express");
var multer = require('multer');
var app = express();
var path = require('path');

app.get('/image', function(req, res) {
    res.render('./admin/image-upload');
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

app.post('/image', function(req, res) {
    var upload = multer({
        storage: storage,
        fileFilter: function(req, file, callback) {
            var ext = path.extname(file.originalname)
            if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
                return callback(res.end('Only images are allowed'), null);
            }
            callback(null, true);
        }
    }).single('userFile');
    upload(req, res, function(err) {
        if(err){
           res.json(err);
        }
        else {
            res.end('File is uploaded');
        }
    });
});

module.exports = app;