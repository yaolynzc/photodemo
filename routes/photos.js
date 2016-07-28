// var express = require('express');
// var photosr = express.Router();

// 照片上传所需要引入的模块
var Photo = require('../models/Photo');   //引入Photo模型
var path = require('path');
var fs = require('fs');
var util = require('util');
var join = path.join;

var photos = [];
photos.push({
  name:'Node.js Logo',
  path:'http://nodejs.org/images/logos/nodejs-green.png'
  //path:__dirname + 'public/photos/nodejs-green.png'
});
photos.push({
  name:'Ryan Speaking',
  path:'http://nodejs.org/images/ryan-speaker.jpg'
  //path:__dirname + 'public/photos/ryan-speaker.jpg'
});

exports.list = function(req,res,next){
  Photo.find({},function(err,photos){
    if(err) return next(err);
    res.render('photos',{
      title:'Photos',
      photos:photos
    });
  });
}

//添加表单路由
exports.form = function(req,res){
  res.render('photos/upload',{
    title:'Photo upload'
  });
}

exports.submit = function(dir){
  return function(req,res,next){
    // console.log('hello:'+ req.files);
    var img = req.files.photo.image;
    var name = req.body.photo.name || img.name;
    var path = join(dir,img.name);

    var readStream = fs.createReadStream(img.path);
    var writeStream = fs.createWriteStream(path);

    readStream.pipe(writeStream,{end:false});
    readStream.on('end',function(err){
      if(err) return next(err);

      Photo.create({
        name:name,
        path:img.name
      },function(err){
        if(err) return next(err);
        res.redirect('/');
      });
    });
  }
}

exports.download = function(dir){
  return function(req,res,next){
    var id = req.params.id;
    Photo.findById(id,function(err,photo){
      if(err) return next(err);
      var path = join(dir,photo.path);
      res.sendfile(path);
      //res.download(path,photo.name + '.jpg');
    });
  };
}

// photosr.get('/',function(req, res, next){
//   Photo.find({},function(err,photos){
//     if(err) return next(err);
//     res.render('photos',{
//       title:'Photos',
//       photos:photos
//     });
//   });
// });
//
// photosr.get('/upload',function(req,res,next){
//   res.render('photos/upload',{
//     title:'Photo upload'
//   });
// });
//
// photosr.post('/upload',function(req,res,next){
//   var img = req.files.photo.image;
//   var name = req.body.photo.name || img.name;
//   var path = join(__dirname,img.name);
//
//   fs.rename(img.path,path,function(err){
//     if(err) {
//       console.log(err);
//       return next(err);
//     }
//
//     Photo.create({
//       name:name,
//       path:img.name
//     },function(err){
//       if(err) return next(err);
//       res.redirect('/');
//     });
//   });
// });

// module.exports = photosr;
