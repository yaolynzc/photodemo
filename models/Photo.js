var mongoose = require('mongoose');
mongoose.connect('mongodb://220.249.123.36:27018/photo_app');

var schema = new mongoose.Schema({
  name:String,
  path:String
});

module.exports = mongoose.model('Photo',schema);
