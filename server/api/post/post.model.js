'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PostSchema = new Schema({

});

var PostSchema = new Schema({
   user: {type: Schema.Types.ObjectId, ref: "User"},
   date: { type: Date, default: Date.now },
   caption: String //,
   //image: //////

   //name: String,
   //info: String,
   //active: Boolean
});

module.exports = mongoose.model('Post', PostSchema);